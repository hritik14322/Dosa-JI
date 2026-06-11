/**
 * pnpm hook: strip esbuild's postinstall script before pnpm processes it.
 * esbuild ships a native binary via optional dependencies (@esbuild/linux-x64 etc.)
 * so the postinstall script is only a verification step — not needed at runtime.
 * Removing it here avoids [ERR_PNPM_IGNORED_BUILDS] on hosts that block unsigned scripts.
 */
function readPackage(pkg) {
  if (pkg.name === 'esbuild' && pkg.scripts) {
    delete pkg.scripts.postinstall;
    delete pkg.scripts.install;
    delete pkg.scripts.preinstall;
  }
  return pkg;
}

module.exports = { hooks: { readPackage } };
