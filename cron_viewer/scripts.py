import argparse
import locale

from dotenv import load_dotenv
from cron_viewer.cron import CronViewer

try:
    locale.setlocale(locale.LC_ALL, "pt_BR.UTF-8")
except Exception as ex:
    print('[cronv]:', ex)

def deploy(output_path: str, env_file: str):
    load_dotenv(env_file)
    CronViewer(output_path).run()


def main():
    global_parser = argparse.ArgumentParser(prog='cronv')
    subparsers    = global_parser.add_subparsers(dest='command', title='commands')
    
    deploy_parser = subparsers.add_parser('deploy', help='Deploy cron docs on CI/CD pipelines')
    deploy_parser.add_argument('-o', '--output', type=str, help='The output folder which contains the static files')
    deploy_parser.add_argument('-e', '--env_file', type=str, help='The path to the cron .env file')
    
    args = global_parser.parse_args()
    
    if(args.command == 'deploy'):
        deploy(output_path=args.output, env_file=args.env_file)
    else:
        global_parser.print_help()