# Cron Viewer
Generate a visual documentation of your cron jobs and easily publish it on **GitHub Pages**.

## 📦 Installation
```
pip install git+https://github.com/EsauM10/cron_viewer.git
```

## 🚀 Basic Usage
After installing, simply run:
```
cronv deploy --output=crons --env_file=".env"
```
This will generate the `crons/` folder with the following static files:
```
crons/
 ├── index.html
 ├── cron.js
 └── styles.css
```


## ⚙️ CLI Options
* `--output=<folder>`
Defines the output folder where the static files will be generated.

* `--env_file=<file>`
Specifies the `.env` file to load environment variables.


## 🧪 Deploy to GitHub Pages
You can automatically publish your documentation on **GitHub Pages** using the workflow below.  
Create a `.github/workflows/deploy.yml` file in your repository with the following content:
```yml
name: Build and Deploy

on:
  push:
    branches: [ "main" ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: pip install -U git+https://github.com/EsauM10/cron_viewer.git

      - name: Generate Cron Docs
        run: cronv deploy --output=crons --env_file=".env"

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: crons/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

Once the pipeline finishes, your documentation will be available at:
```
https://<username>.github.io/<repository>/
```