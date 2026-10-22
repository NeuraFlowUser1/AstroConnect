"""Disconnected exact-source tests for process binding and linked-file refusal."""
import json,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
from appointment_system import configuration,runtime
from tests.fixtures import business,installation

class RuntimeQualification(unittest.TestCase):
    def tearDown(self):
        runtime.contained_release.cache_clear()

    def test_real_contained_identity_is_verified_once_and_cached(self):
        runtime.contained_release.cache_clear()
        with patch('tools.install.package.verify',wraps=__import__('tools.install.package',fromlist=['verify']).verify) as verify:
            first=runtime.contained_release();second=runtime.contained_release()
        self.assertEqual(first,second);self.assertEqual(verify.call_count,1)
        self.assertEqual(first[1],'1bb6cb1cc00a2ead7cec70de052ea78330005d7644dfc0d2e2a40ea7c287b31f')

    def test_symlinked_runtime_or_parent_is_rejected_before_package_verification(self):
        with tempfile.TemporaryDirectory(prefix='abs-runtime-refusal-') as temporary:
            root=Path(temporary);(root/'real').mkdir();(root/'real/runtime.py').write_text('synthetic fixture')
            (root/'linked').symlink_to(root/'real',target_is_directory=True)
            runtime.contained_release.cache_clear()
            with patch.object(runtime,'__file__',str(root/'linked/runtime.py')),patch('tools.install.package.verify') as verify:
                with self.assertRaisesRegex(ValueError,'links are forbidden'):runtime.contained_release()
                verify.assert_not_called()

    def test_only_own_exact_project_settings_can_bind_the_host(self):
        root,_=runtime.contained_release()
        for value in (root/'project.json',root.parent/'other-client/project.json'):
            with self.subTest(path=str(value)),self.assertRaisesRegex(ValueError,'own project settings'):
                runtime.create_application(value,{'SYNTHETIC':'value'})
        with patch('appointment_system.configuration.load') as load,patch('appointment_system.hosting.create_hosted_application',return_value='synthetic-host') as host:
            result=runtime.create_application(root.parent/'appointment-settings/project.json',{'SYNTHETIC':'value'})
        load.assert_called_once_with(root.parent/'appointment-settings/project.json')
        host.assert_called_once_with({'SYNTHETIC':'value'},release_digest=runtime.contained_release()[1]);self.assertEqual(result,'synthetic-host')

class ConfigurationQualification(unittest.TestCase):
    def setUp(self):
        self.previous=configuration._profile
    def tearDown(self):
        configuration._profile=self.previous

    def test_unbound_profile_fails_closed_and_process_cannot_change_installation(self):
        configuration._profile=None
        with self.assertRaises(Exception) as error:configuration.profile()
        self.assertEqual(error.exception.code,'temporarily_unavailable')
        first=configuration.configure(installation(),business())
        self.assertEqual(configuration.configure(installation(),business()),first)
        changed=installation();changed['label']='Another synthetic practice'
        with self.assertRaisesRegex(ValueError,'fresh process'):configuration.configure(changed,business())
        self.assertEqual(configuration.profile(),first)

    def test_explicit_config_load_rejects_missing_oversized_and_linked_inputs(self):
        configuration._profile=None
        with tempfile.TemporaryDirectory(prefix='abs-profile-refusal-') as temporary:
            root=Path(temporary);project=root/'project.json';settings=root/'business-settings.json'
            with self.assertRaisesRegex(ValueError,'Explicit project settings'):configuration.load(project)
            project.write_text(json.dumps(installation()));settings.write_text(json.dumps(business()))
            self.assertEqual(configuration.load(project).facts()['installation_id'],installation()['installation_id'])
            settings.write_bytes(b' '*131073)
            with self.assertRaisesRegex(ValueError,'Explicit project settings'):configuration.load(project)
            settings.unlink();(root/'real-settings.json').write_text(json.dumps(business()));settings.symlink_to(root/'real-settings.json')
            with self.assertRaisesRegex(ValueError,'Explicit project settings'):configuration.load(project)
            settings.unlink();settings.write_text(json.dumps(business()));project.write_bytes(b' '*131073)
            with self.assertRaisesRegex(ValueError,'Explicit project settings'):configuration.load(project)
