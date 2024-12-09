import { App } from "@/app";
import chalk from "chalk";

export abstract class LocatableService {
  static readonly serviceName: string;
  serviceLocator: ServiceLocator;
  app: App;

  constructor(serviceLocator: ServiceLocator) {
    this.serviceLocator = serviceLocator;
    this.app = serviceLocator.app;
    console.log(`${chalk.green('Created LocatableService: ')}${chalk.yellow((this.constructor as typeof LocatableService).name)}`);
  }

  log(messages: string | string[], data?: (string | undefined | null)[]) {
    console.log(`${chalk.green((this.constructor as typeof LocatableService).name)}\n${Array.isArray(messages)
      ? messages.map((message, i) => {
          if (data && data.length > i) {
            return `- ${chalk.yellow(message)}: ${chalk.blueBright(data[i])}`;
          }
          return chalk.yellow(message);
        }).join('\n')
      : chalk.yellow(messages)}
    `);
  }
}

type ServiceClass<T extends LocatableService> = {
  new (...args: any[]): T;
  readonly name: string;
};

export class ServiceLocator {
  private _services: Map<string, LocatableService>;
  app: App;

  constructor(app: App) {
    this._services = new Map();
    this.app = app;
  }

  addService<T extends LocatableService>(serviceClass: ServiceClass<T>, instance: T): void {
    this._services.set(serviceClass.name, instance);
  }

  getService<T extends LocatableService>(
    ServiceClass: ServiceClass<T>
  ): T {
    const service = this._services.get(ServiceClass.name);
    if (!service) {
      throw new Error(`Service ${ServiceClass.name} not found`);
    }
    return service as T;
  }
}
