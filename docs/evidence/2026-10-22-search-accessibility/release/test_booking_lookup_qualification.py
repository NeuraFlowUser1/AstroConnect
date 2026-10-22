"""Exact read-only lookup contracts; synthetic store, no database/providers."""
import base64,json,unittest
from datetime import datetime,timezone,timedelta
from types import SimpleNamespace
from unittest.mock import Mock,patch
from uuid import UUID
from starlette.requests import Request
from pydantic import ValidationError
from appointment_system import booking_lookup as module
from appointment_system.access import AccessDenied
from appointment_system.connection import StorageUnavailable
from appointment_system.rate_limit import RateLimited,risk_digest
ID='11111111-1111-4111-8111-111111111111'
OTHER='22222222-2222-4222-8222-222222222222'
NOW='2031-04-01T05:00:00+00:00'
START='2031-04-04T05:00:00+00:00'
END='2031-04-04T05:30:00+00:00'
def model(**change):return module.LookupRequest(full_name='Synthetic Patient',phone='+919876543210',**change)
def summary(**change):return dict(request_id=ID,booking_revision=1,service_name='Synthetic consultation',starts_at=START,ends_at=END,timezone='Asia/Kolkata',appointment_state='confirmed',bucket=0,**change)
def snapshot(state='confirmed',**change):
    row=dict(request_id=ID,state=state,order_state='ready',payment_state='captured',hold_expires_at=START,
             captured_paise=210000,refunded_paise=0,service_name='Synthetic consultation',amount_paise=210000,currency='INR',starts_at=START,ends_at=END,
             practice_timezone='Asia/Kolkata',provider_order_id='order_synthetic',attempted_at=NOW,meeting_state='not_created',acknowledgement_state='delivered',meeting_email_state='not_requested',booking_revision=1,meeting_mode='internal')
    row.update(change);return dict(server_now=NOW,booking=row)
def request(*,origins=None,epoch=OTHER):
    value=Request({'type':'http','headers':[(b'origin',item.encode()) for item in (origins if origins is not None else ['https://practice.example.test'])]})
    if epoch is not None:value.state.booking_activation_epoch=epoch
    return value
class Routes:
    def post(self,path):
        assert path==module.PATH
        def decorate(endpoint):self.endpoint=endpoint;return endpoint
        return decorate

class LookupQualification(unittest.TestCase):
    def route(self,result):
        store=Mock();store.booking_details.return_value=result;routes=Routes();module.add_routes(routes,store)
        return routes.endpoint,store

    def test_identity_model_enforces_unicode_controls_phone_canonical_reference_and_one_selection(self):
        self.assertEqual(model().phone,'+919876543210')
        self.assertEqual(module.LookupRequest(full_name='Synthetic\tPatient',phone='+919876543210').full_name,'Synthetic\tPatient')
        for change in ({'full_name':' A '},{'full_name':'Synthetic\x7fPatient'},{'phone':'bad'},{'request_id':'AAAAAAAA-1111-4111-8111-111111111111'},{'request_id':'00000000-0000-0000-0000-000000000000'},{'request_id':1},{'cursor':None},{'cursor':'!'},{'cursor':'page','request_id':ID}):
            values={'full_name':'Synthetic Patient','phone':'+919876543210',**change}
            with self.subTest(fields=list(change)),self.assertRaises(ValidationError):module.LookupRequest(**values)
        self.assertEqual(model(request_id=ID).request_id,UUID(ID));self.assertEqual(model(cursor='page-2').cursor,'page-2')

    def test_opaque_cursor_roundtrip_is_ordering_only_and_never_contains_a_phone_or_name(self):
        self.assertEqual(module.decode_cursor(None),(None,None,None,None))
        cursor=module.encode_cursor(NOW,summary())
        result=module.decode_cursor(cursor)
        self.assertEqual(result,(datetime.fromisoformat(NOW),0,datetime.fromisoformat(START),UUID(ID)))
        self.assertNotIn('Synthetic',cursor);self.assertNotIn('9876543210',cursor)

    def test_cursor_rejects_shape_identity_version_bucket_and_non_utc_or_malformed_time_without_echo(self):
        body={'v':1,'as_of':NOW,'bucket':0,'start':START,'id':ID}
        for change in ({'v':True},{'v':2},{'bucket':True},{'bucket':2},{'id':None},{'id':'00000000-0000-0000-0000-000000000000'},{'start':7},{'start':'2031-04-04T10:30:00+05:30'},{'start':'not-a-time'},{'as_of':'x'*41},{'extra':1}):
            raw=base64.urlsafe_b64encode(json.dumps(body|change).encode()).decode().rstrip('=')
            with self.subTest(fields=list(change)),self.assertRaisesRegex(ValueError,r'^Refresh the booking list\.$'):module.decode_cursor(raw)
        for raw in ('!',base64.urlsafe_b64encode(b'[]').decode(),base64.urlsafe_b64encode(b'PRIVATE INVALID JSON').decode()):
            with self.assertRaisesRegex(ValueError,r'^Refresh the booking list\.$'):module.decode_cursor(raw)
        with patch.object(module,'timestamp',return_value=datetime(2031,1,1,tzinfo=timezone(timedelta(hours=1)))):
            with self.assertRaisesRegex(ValueError,r'^Refresh the booking list\.$'):module.decode_cursor(module.encode_cursor(NOW,summary()))

    def test_preparse_admission_requires_one_exact_origin_current_epoch_and_committed_boolean_limit(self):
        store=Mock();store.consume_booking_lookup_limits.return_value={'allowed':True}
        settings=SimpleNamespace(origin='https://practice.example.test',risk_key=b'synthetic-risk-key'.ljust(32,b'0'))
        admit=module.preparse_admission(store,settings,lambda _:'127.0.0.1')
        admit(request());store.consume_booking_lookup_limits.assert_called_once_with(risk_digest('127.0.0.1',settings.risk_key),OTHER)
        for origins in ([],['https://other.example.test'],[settings.origin,settings.origin]):
            with self.subTest(origins=origins),self.assertRaises(AccessDenied):admit(request(origins=origins))
        with self.assertRaises(StorageUnavailable):admit(request(epoch=None))
        for value in (None,[],{'allowed':1}):
            store.consume_booking_lookup_limits.return_value=value
            with self.assertRaises(StorageUnavailable):admit(request())
        for value,expected in (({'allowed':False},60),({'allowed':False,'retry_after':7},7)):
            store.consume_booking_lookup_limits.return_value=value
            with self.assertRaises(RateLimited) as error:admit(request())
            self.assertEqual(error.exception.retry_after,expected)

    def test_list_projection_filters_internal_fields_and_paginates_only_after_twenty_matches(self):
        rows=[summary()|{'request_id':f'{index+1:08d}-1111-4111-8111-111111111111','private_secret':'never expose'} for index in range(21)]
        endpoint,store=self.route({'items':rows,'server_now':NOW,'as_of':NOW})
        result=endpoint(request(),model());self.assertEqual(result['kind'],'list');self.assertEqual(len(result['items']),20)
        self.assertEqual(set(result['items'][0]),set(module.SUMMARY_FIELDS));self.assertNotIn('private_secret',json.dumps(result));self.assertIsNotNone(result['next_cursor'])
        self.assertEqual(module.decode_cursor(result['next_cursor'])[-1],UUID(rows[19]['request_id']))
        store.booking_details.assert_called_once_with('Synthetic Patient','+919876543210',OTHER,None,None,None,None,None)
        endpoint,_=self.route({'items':[],'server_now':NOW,'as_of':NOW});self.assertEqual(endpoint(request(),model())['next_cursor'],None)

    def test_invalid_cursors_or_names_return_field_specific_corrections_without_querying_bad_cursor(self):
        endpoint,store=self.route({});result=endpoint(request(),model(cursor='bad-cursor'));self.assertEqual(result.status_code,422);self.assertEqual(json.loads(result.body)['fields'],['cursor']);store.booking_details.assert_not_called()
        for code,field in (('invalid_cursor','cursor'),('invalid_name','full_name')):
            endpoint,_=self.route({'code':code});result=endpoint(request(),model());self.assertEqual(result.status_code,422);self.assertEqual(json.loads(result.body)['fields'],[field])

    def test_missing_epoch_corrupt_store_or_invalid_list_rows_fail_closed(self):
        endpoint,store=self.route({'items':[],'server_now':NOW,'as_of':NOW})
        with self.assertRaises(StorageUnavailable):endpoint(request(epoch=None),model())
        store.booking_details.assert_not_called()
        for value in (None,[],{'items':None},{'items':[summary()]*22},{'items':[None]},{'items':[{}]},{'items':[summary()|{'bucket':True}]},{'items':[summary()|{'bucket':2}]}):
            endpoint,_=self.route(value)
            with self.subTest(value_type=type(value).__name__),self.assertRaises(StorageUnavailable):endpoint(request(),model())

    def test_matched_detail_exposes_only_read_capabilities_never_payment_or_change_authority(self):
        for state,changes,download in (('confirmed',{},True),('held',{},False),('confirmed',{'meeting_mode':'google_meet'},True)):
            endpoint,store=self.route(snapshot(state,**changes));result=endpoint(request(),model(request_id=ID));self.assertEqual(result['kind'],'detail');self.assertEqual(result['receipt']['request_id'],ID)
            self.assertEqual(result['capabilities'],{'refresh':True,'download_pdf':download});self.assertNotIn('next_actions',result['receipt']);self.assertNotIn('secret',json.dumps(result))
            self.assertEqual(store.booking_details.call_args.args[3],UUID(ID))
        value=snapshot();del value['booking']['booking_revision'];endpoint,_=self.route(value);self.assertFalse(endpoint(request(),model(request_id=ID))['capabilities']['download_pdf'])
        endpoint,_=self.route({'booking':None});result=endpoint(request(),model(request_id=ID));self.assertEqual(result.status_code,404);self.assertEqual(json.loads(result.body)['code'],'booking_not_found')
