import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { CryptoService } from './app/services/crypto.service';
import { environment } from './environments/environment';

// Expose the encryption key on window for the CryptoService to pick up
// In production this is replaced by CI/CD; in dev it uses the environment key
(window as unknown as { APP_ENCRYPTION_KEY?: string }).APP_ENCRYPTION_KEY =
  environment.encryptionKey;

bootstrapApplication(AppComponent, appConfig)
  .then((ref) => {
    const cryptoService = ref.injector.get(CryptoService);
    const key = (window as unknown as { APP_ENCRYPTION_KEY?: string }).APP_ENCRYPTION_KEY;
    if (key) {
      cryptoService.initializeKey(key);
    }
  })
  .catch(err => console.error(err));
