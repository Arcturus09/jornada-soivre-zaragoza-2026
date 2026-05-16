(function() {
  var clave = 'Zaragoza2026';
  var ok = sessionStorage.getItem('soivre_auth');
  if (ok === '1') return;

  var pantalla = document.createElement('div');
  pantalla.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#1a2e4a;display:flex;align-items:center;justify-content:center;';
  pantalla.innerHTML = `
    <div style="background:#f7f3ec;padding:2.5rem 3rem;border-radius:8px;text-align:center;max-width:360px;width:90%;">
      <div style="font-family:serif;font-size:1.6rem;font-weight:700;color:#1a2e4a;margin-bottom:0.25rem;">
        Jornada SOIVRE
      </div>
      <div style="font-family:sans-serif;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:#8B1A1A;margin-bottom:2rem;">
        Zaragoza · Mayo 2026
      </div>
      <input id="pwd" type="password" placeholder="Contraseña"
        style="width:100%;padding:0.75rem 1rem;border:1px solid #ccc;border-radius:4px;font-size:1rem;margin-bottom:1rem;box-sizing:border-box;">
      <button onclick="comprobar()"
        style="width:100%;padding:0.75rem;background:#8B1A1A;color:white;border:none;border-radius:4px;font-size:0.85rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;">
        Acceder
      </button>
      <div id="error" style="color:#8B1A1A;font-size:0.8rem;margin-top:0.75rem;display:none;">
        Contraseña incorrecta
      </div>
    </div>`;
  document.body.appendChild(pantalla);

  document.getElementById('pwd').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') comprobar();
  });

  window.comprobar = function() {
    if (document.getElementById('pwd').value === clave) {
      sessionStorage.setItem('soivre_auth', '1');
      pantalla.remove();
    } else {
      document.getElementById('error').style.display = 'block';
      document.getElementById('pwd').value = '';
      document.getElementById('pwd').focus();
    }
  };
})();
