"""Current frozen-source target reconciliation; no provider/customer access."""
import json,re
from pathlib import Path
import coverage

APP=Path(__file__).resolve().parents[4]
OUT=APP/'verification-results'
ROOT=APP.parent/'releases/standard-qualification'
EXPECTED='1bb6cb1cc00a2ead7cec70de052ea78330005d7644dfc0d2e2a40ea7c287b31f'

def main():
    reports={}
    outcomes={}
    for target in ('pg16','pg18'):
        report=json.loads((OUT/f'neutral-{target}-rc3-result.json').read_text())
        assert report['release_digest']==EXPECTED and report['successful'] and report['source_unchanged']
        assert not report['failures'] and not report['errors']
        log=Path(f'/tmp/project003-clean-neutral-{target}.log').read_text()
        cases={}
        starts=list(re.finditer(r'^test_\S+ \((tests\.[^)]+)\) \.\.\. ',log,re.M))
        for index,match in enumerate(starts):
            chunk=log[match.end():starts[index+1].start() if index+1<len(starts) else len(log)]
            first=chunk.splitlines()[0]
            if first=='ok' or first.startswith('skipped '):outcome=first
            else:
                # A bounded application diagnostic may precede unittest's own
                # final status. Credit only a literal standalone successful end.
                assert re.search(r'^ok$',chunk,re.M) and not re.search(r'^(FAIL|ERROR|skipped )',chunk,re.M)
                outcome='ok'
            cases.setdefault(match[1],[]).append(outcome)
        assert sum(map(len,cases.values()))==report['executed']==report['discovered']
        reports[target]=report;outcomes[target]=cases
    assert reports['pg16']['source_sha256']==reports['pg18']['source_sha256']
    assert reports['pg16']['input_sha256']==reports['pg18']['input_sha256']
    counterparts=[]
    for target,other in (('pg16','pg18'),('pg18','pg16')):
        for item in reports[target]['skips']:
            assert 'ok' in outcomes[other].get(item['id'],[]),('Unproved skipped case',target,item)
            counterparts.append({'skipped_target':target,'actual_pass_target':other,**item})
    supplemental=OUT/'neutral-runtime-rc3-result.json'
    extra=[]
    if supplemental.is_file():
        value=json.loads(supplemental.read_text())
        assert value['successful'] and value['source_unchanged'] and value['release_digest']==EXPECTED
        assert value['source_sha256']==reports['pg16']['source_sha256']
        extra.append(str(OUT/'.coverage.neutral-runtime-rc3'))
    measure=coverage.Coverage(branch=True,config_file=False,data_file=str(OUT/'.coverage.neutral-combined-rc3'))
    measure.set_option('report:exclude_lines',[]);measure.set_option('report:partial_branches',[])
    measure.combine(data_paths=[str(OUT/f'.coverage.neutral-{target}-rc3') for target in ('pg16','pg18')]+extra,keep=True)
    measure.get_data().touch_files(str(ROOT/name) for name in reports['pg16']['source_sha256'])
    measure.save();measure.json_report(outfile=str(OUT/'neutral-combined-rc3-coverage.json'))
    data=json.loads((OUT/'neutral-combined-rc3-coverage.json').read_text())
    assert {str(Path(name).resolve()) for name in data['files']}=={str((ROOT/name).resolve()) for name in reports['pg16']['source_sha256']}
    inventory=json.loads((APP.parents[2]/'001-implementation-evidence/2026-10-04-complete-local-checks/python-domain-inventory.json').read_text())['files']
    inventory.update({'engine/appointment_system/booking_lookup.py':'booking-scheduling-payments',
                      'engine/appointment_system/contact_correction.py':'staff-company-control',
                      'engine/appointment_system/receipt_copy.py':'verification-enquiries-mail'})
    domains={}
    for name,entry in data['files'].items():
        relative=Path(name).resolve().relative_to(ROOT.resolve()).as_posix()
        assert relative in inventory,('Unassigned working owner',relative)
        value=entry['summary'];domain=domains.setdefault(inventory[relative],{'statements':0,'covered_statements':0,'branches':0,'covered_branches':0,'owners':[]})
        domain['owners'].append(relative)
        for field,key in (('statements','num_statements'),('covered_statements','covered_lines'),('branches','num_branches'),('covered_branches','covered_branches')):domain[field]+=value[key]
    for domain in domains.values():
        domain['statement_percent']=100*domain['covered_statements']/domain['statements'] if domain['statements'] else 100
        domain['branch_percent']=100*domain['covered_branches']/domain['branches'] if domain['branches'] else 100
        domain['threshold_met']=domain['statement_percent']>=90 and domain['branch_percent']>=90
    result={'release_digest':EXPECTED,'source_unchanged':True,'manifest_files':579,
            'targets':{key:{field:value[field] for field in ('target','discovered','executed','successful','seconds','coverage')} for key,value in reports.items()},
            'all_target_skips_have_actual_other_target_pass':True,'counterparts':counterparts,
            'working_python_files':len(reports['pg16']['source_sha256']),'combined_coverage':data['totals'],
            'runtime_supplement_used':bool(extra),'domains':domains,'all_original_domains_meet_90_statements_and_branches':all(domain['threshold_met'] for domain in domains.values()),
            'coverage_denominator':'Every working Python owner under engine and tools, including zero-hit owners. No exclusions.',
            'provider_actions':0,'customer_actions':0,'qualification_complete':False}
    (OUT/'neutral-target-reconciliation.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({key:result[key] for key in ('release_digest','working_python_files','all_target_skips_have_actual_other_target_pass','all_original_domains_meet_90_statements_and_branches','combined_coverage')}))

if __name__=='__main__':main()
