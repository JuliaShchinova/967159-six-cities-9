import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { getErrorMessage } from '../../shared/helpers/index.js';
import { Command } from './command.interface.js';
import { Offer } from '../../shared/types/offer.type.js';


export class ImportCommand implements Command {
  public getName (): string {
    return '--import';
  }

  public async execute (...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    if (!filename) {
      throw new Error('Unexpected parameter: filename not found');
    }

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch (err) {
      console.error(`Can't import data from file ${filename}`);
      console.error(getErrorMessage(err));
    }
  }

  private onImportedOffer (offer: Offer): void {
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }
}
