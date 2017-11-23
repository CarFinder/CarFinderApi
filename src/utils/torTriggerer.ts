import { spawn } from 'child_process';

export class TorTriggerer {
  public run: () => void;
  public close: () => void;
  public tor: any;

  constructor() {
    this.run = () => {
      this.tor = spawn('tor');

      this.tor.on('close', () => {
        process.exit();
      });
    };

    this.close = () => {
      // kill tor
      this.tor.kill();
      process.kill(this.tor.pid + 1);
    };
  }
}

const torTriggerer = new TorTriggerer();

export { torTriggerer };
