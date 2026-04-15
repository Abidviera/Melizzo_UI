import { AppComponent } from './app.component';
import { config } from './app.config.server';

export default class ServerAppModule {
  ngDoBootstrap() {}
}

export { config };
