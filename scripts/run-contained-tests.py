"""Standard contained unittest runner; actual native skips stay explicit."""
import argparse
import json
import os
from pathlib import Path
import shutil
import sys
import tempfile
import unittest

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('mode', choices=('fast', 'release'))
    parser.add_argument('output')
    args = parser.parse_args()
    package = Path(__file__).resolve().parents[1] / 'appointment-system'
    if Path.cwd().resolve() != package.resolve():
        raise ValueError('contained_package_cwd_required')
    if args.mode == 'release':
        if os.environ.get('BOOKING_SQL_TEST_TARGET') not in ('abs-implementation-pg16', 'abs-implementation-pg18'):
            raise ValueError('owned_isolated_SQL_target_required')
        factory = next((parent for parent in package.parents if parent.name == 'neuraflow-website-factory'), None)
        if factory and factory in Path(sys.prefix).resolve().parents:
            raise ValueError('release_requires_test_python_outside_factory_for_containment_proof')
    else:
        if os.environ.get('BOOKING_SQL_TEST_TARGET'):
            raise ValueError('fast_SQL_target_forbidden')
        if os.environ.get('BOOKING_LEGACY_SQL_PROOF'):
            raise ValueError('fast_historical_SQL_authority_forbidden')
    # Common fixtures use synthetic installation identities. Run their exact
    # sealed source away from the receiving client's real settings, and give
    # the observer a second installation to prove source/client independence.
    # Neither copy contains runtime secrets, website code or node_modules.
    output = Path(args.output).resolve()
    scratch = package.parent / 'verification-results'
    scratch.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='contained-source-', dir=scratch) as temporary:
        neutral = Path(temporary) / 'neutral-package'
        ignored = shutil.ignore_patterns('node_modules', '__pycache__', '.wrangler')
        shutil.copytree(package, neutral, ignore=ignored)
        if args.mode == 'release':
            project = Path(temporary) / 'client'
            shutil.copytree(package, project / 'appointment-system', ignore=ignored)
            settings = project / 'appointment-settings'
            settings.mkdir()
            for name in ('project.json', 'monitor.json'):
                shutil.copyfile(package.parent / 'appointment-settings' / name, settings / name)
            os.environ['BOOKING_TEST_PROJECT'] = str(project)
        # The neutral package has no appointment-settings sibling. Every
        # server fixture therefore uses its declared synthetic profile.
        sys.path[:] = [value for value in sys.path
                       if value and Path(value).resolve() != package.resolve()
                       and package.resolve() not in Path(value).resolve().parents]
        sys.path[:0] = [str(neutral), str(neutral / 'engine')]
        os.environ['PYTHONPATH'] = str(neutral / 'engine')
        os.chdir(neutral)
        suite = unittest.defaultTestLoader.discover('tests', pattern='test_*.py', top_level_dir='.')
        discovered = suite.countTestCases()
        result = unittest.TextTestRunner(verbosity=2).run(suite)
    successful = discovered > 0 and result.wasSuccessful() and not result.expectedFailures and result.testsRun == discovered
    report = {'mode': args.mode, 'discovered_occurrences': discovered, 'executed_occurrences': result.testsRun,
              'successful': successful, 'qualification': False, 'coverage_measured': False,
              'failures': [test.id() for test, _ in result.failures], 'errors': [test.id() for test, _ in result.errors],
              'skips': [{'id': test.id(), 'reason': reason} for test, reason in result.skipped],
              'expected_failures': [test.id() for test, _ in result.expectedFailures],
              'unexpected_successes': [test.id() for test in result.unexpectedSuccesses],
              'scope': 'Development checks only. Exact exhaustive occurrence, counterpart, coverage and provider gates remain separate.'}
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report))
    return 0 if successful else 1

if __name__ == '__main__':
    raise SystemExit(main())
