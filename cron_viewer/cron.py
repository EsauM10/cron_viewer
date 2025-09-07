from datetime import datetime
import json
import os
from pathlib import Path
import shutil

from croniter import croniter
from cron_descriptor import ExpressionDescriptor

from cron_viewer.helpers import create_file, read_file

BASEDIR  = str(Path(__file__).parent)
TEMPLATES_DIR = os.path.join(BASEDIR, 'templates')
TEMPLATE_CRON_FILE = os.path.join(TEMPLATES_DIR, 'cron.js')
TEMPLATE_INDEX_HTML_FILE = os.path.join(TEMPLATES_DIR, 'index.html')
TEMPLATE_STYLES_FILE = os.path.join(TEMPLATES_DIR, 'styles.css')

class CronViewer:
    def __init__(self,
        output_path: str,
        cron_prefix: str = '_CRON_TIME', 
        locale_code: str = 'pt_BR'
    ):
        self.output_path = output_path
        self.cron_prefix = cron_prefix
        self.locale_code = locale_code

    def _create_job_data(self, env_variable: str, cron: str, start_time: datetime) -> dict[str, str]:
        itr = croniter(cron, start_time)
        descriptor = ExpressionDescriptor(
            cron, 
            locale_code=self.locale_code,
            use_24hour_time_format=True
        )

        return {
            'name': env_variable.replace(self.cron_prefix, ''),
            'cron': cron,
            'description': descriptor.get_description(),
            'nextRun': itr.get_next(datetime).strftime('%d/%m/%Y %H:%M:%S'),
            'status': 'Ativo'
        }

    def get_jobs(self) -> list[dict[str, str]]:
        jobs = []
        now = datetime.now()

        for key, value in os.environ.items():
            try:
                if(not key.endswith(self.cron_prefix)):
                    continue

                data = self._create_job_data(env_variable=key, cron=value, start_time=now)
                jobs.append(data)
            except: pass
        
        return jobs
        
    
    def run(self):
        jobs = self.get_jobs()
        data = json.dumps(jobs, indent=2)

        cron_js_template = read_file(TEMPLATE_CRON_FILE)
        cron_js_content = cron_js_template.replace('{CRON_JOBS}', data)
        cron_js_path = os.path.join(self.output_path, 'cron.js')
        create_file(cron_js_path, data=cron_js_content)

        index_html_path = os.path.join(self.output_path, 'index.html')  
        shutil.copy(TEMPLATE_INDEX_HTML_FILE, index_html_path)
        
        styles_css_path = os.path.join(self.output_path, 'styles.css')  
        shutil.copy(TEMPLATE_STYLES_FILE, styles_css_path)
