"""Reviewed operator-only SQL generator; no connection, secret or product import.

Execute statements() as ONE transaction on the declared schema owner's physical
connection. Never issue configure_worker_release by itself. Fresh readback is
required after commit or an unknown reply; a new owner command always wins.
"""
import re
from uuid import UUID
from urllib.parse import urlsplit


def literal(value):return "'"+value.replace("'","''")+"'"

def statement(*,installation,project,origin,expected_digest,new_digest,generation,operation,revision,owner='neondb_owner'):
    for value in (installation,generation,operation):
        if type(value) is not str or str(UUID(value))!=value or not UUID(value).int:raise ValueError('nonzero_uuid_required')
    for value in (expected_digest,new_digest):
        if type(value) is not str or not re.fullmatch('[a-f0-9]{64}',value):raise ValueError('release_digest_required')
    if expected_digest==new_digest:raise ValueError('different_expected_and_next_release_required')
    if project not in ('003','004'):raise ValueError('declared_project_required')
    p=urlsplit(origin)
    if p.scheme!='https' or p.path or p.query or p.fragment or p.username or p.password or p.port or p.netloc!=p.hostname:raise ValueError('exact_origin_required')
    if type(revision) not in (str,int) or not re.fullmatch('[1-9][0-9]{0,18}',str(revision)):raise ValueError('revision_required')
    if owner not in ('neondb_owner','postgres'):raise ValueError('declared_owner_required')
    return f"""DO $guarded_worker_binding$
DECLARE installation_row appointment_system.installation%ROWTYPE;
 control_row appointment_system.control_product_state%ROWTYPE;
 runtime appointment_system.worker_release%ROWTYPE;
BEGIN
 IF current_user IS DISTINCT FROM {literal(owner)} THEN
  RAISE EXCEPTION USING ERRCODE='P0403',MESSAGE='guarded_binding_owner_mismatch';
 END IF;
 -- Same restore barrier and worker lock ordering used by the installed engine.
 PERFORM pg_advisory_xact_lock_shared(83124,5);
 PERFORM pg_advisory_xact_lock(83124,4);
 SELECT * INTO STRICT installation_row FROM appointment_system.installation WHERE singleton FOR UPDATE;
 SELECT * INTO STRICT control_row FROM appointment_system.control_product_state WHERE singleton FOR UPDATE;
 SELECT * INTO STRICT runtime FROM appointment_system.worker_release WHERE singleton FOR UPDATE;
 IF installation_row.installation_id IS DISTINCT FROM {literal(installation)}::uuid
  OR installation_row.project_id IS DISTINCT FROM {literal(project)}
  OR installation_row.environment IS DISTINCT FROM 'production'
  OR control_row.project IS DISTINCT FROM {literal(project)}
  OR control_row.environment IS DISTINCT FROM 'production'
  OR control_row.origin IS DISTINCT FROM {literal(origin)} THEN
  RAISE EXCEPTION USING ERRCODE='P0409',MESSAGE='guarded_binding_installation_mismatch';
 END IF;
 IF control_row.enabled IS DISTINCT FROM false OR control_row.requested_enabled IS DISTINCT FROM false
  OR control_row.restore_generation IS DISTINCT FROM {literal(generation)}::uuid
  OR control_row.winning_operation IS DISTINCT FROM {literal(operation)}::uuid
  OR control_row.revision IS DISTINCT FROM {int(revision)}::bigint THEN
  RAISE EXCEPTION USING ERRCODE='P0409',MESSAGE='guarded_binding_company_intent_changed';
 END IF;
 -- Check under both advisory and row locks immediately before the old function.
 IF runtime.release_digest IS DISTINCT FROM {literal(expected_digest)} THEN
  RAISE EXCEPTION USING ERRCODE='P0409',MESSAGE='guarded_binding_release_changed';
 END IF;
 IF runtime.active_until>clock_timestamp()
  OR (runtime.active_run IS NOT NULL AND runtime.active_until IS NULL) THEN
  RAISE EXCEPTION USING ERRCODE='P0409',MESSAGE='guarded_binding_lease_not_idle';
 END IF;
 PERFORM appointment_system.configure_worker_release({literal(new_digest)});
 IF NOT EXISTS(SELECT 1 FROM appointment_system.worker_release WHERE singleton
  AND release_digest={literal(new_digest)} AND active_run IS NULL AND active_until IS NULL) THEN
  RAISE EXCEPTION USING ERRCODE='P0409',MESSAGE='guarded_binding_readback_mismatch';
 END IF;
END $guarded_worker_binding$;"""


def statements(**values):
    return ["SET LOCAL lock_timeout='3s';", "SET LOCAL statement_timeout='5s';", statement(**values)]
