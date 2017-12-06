import { spawn } from 'child_process';

export class TorTriggerer {
  public run: () => void;
  public close: () => void;
  public tor: any;

  constructor() {
    this.run = () => {
      this.tor = spawn('tor');
    };

    this.close = () => {
      // kill tor
      this.tor.kill();
    };
  }
}

const torTriggerer = new TorTriggerer();

export { torTriggerer };
