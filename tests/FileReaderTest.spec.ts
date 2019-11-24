import { expect } from 'chai';
import { describe, it } from 'mocha';
import { FileReader } from '../src/reader/FileReader';
import { MockTransport } from './MockTransport';


describe('FileReader service tests', () => {
  const transport = new MockTransport('someurl');
  it('should create instance of FileReader', async () => {
    const fileReader = new FileReader('./README.md', transport, 'transfer');
    expect(fileReader).to.be.an.instanceof(FileReader);
  });
  it('should throw error on not found file', async () => {
    let fileReader;
    let errMessage = '';
    try {
      fileReader = new FileReader('notfound', transport, 'transfer');
    } catch (err) {
      errMessage = err.message;
    }
    expect(errMessage).to.be.eq('ENOENT: no such file or directory, stat \'notfound\'');
  });
  it('should exec without err', async () => {
    const fileReader = new FileReader('./README.md', transport, 'transfer');
    let errMessage = '';
    try {
      await fileReader.exec();
    } catch (err) {
      errMessage = err.message;
    }
    expect(errMessage).to.be.eq('');
  });
});
