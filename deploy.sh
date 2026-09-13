#!/bin/bash
# Deploy script for Imóveis Aracaju
# Run after GitHub authentication

echo "=========================================="
echo "  IMOVEIS ARACAJU - DEPLOY AUTOMÁTICO"
echo "=========================================="
echo ""

# Create GitHub repo
echo "1/4 Criando repositório..."
gh repo create imoveis-aracaju --public --source=. --push

# Enable GitHub Pages
echo "2/4 Habilitando GitHub Pages..."
gh api --method PATCH /repos/$GH_REPOSITORY_OWNER/imoveis-aracaju \
  -f page_build=true -f pages={{"source":{"branch":"main","path":"/"}}} 2>/dev/null || true

# Create GitHub Pages workflow
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
EOF

git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages workflow"
git push origin main

echo ""
echo "=========================================="
echo "  ✅ SITE DEPLOYADO COM SUCESSO!"
echo "=========================================="
echo ""
echo "Acesse: https://$GH_REPOSITORY_OWNER.github.io/imoveis-aracaju"
echo ""
echo "O GitHub Pages levará alguns minutos para estar online."
