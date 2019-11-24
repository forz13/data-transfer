import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as fs from 'fs';
import { FileWriter } from '../src/writer/FileWriter';
import { MockTransport } from './MockTransport';

describe('FileWriter service tests', () => {
  const transport = new MockTransport('someurl');
  it('should create instance of FileWriter', async () => {
    const fileWriter = new FileWriter('./', transport, 'transfer');
    expect(fileWriter).to.be.an.instanceof(FileWriter);
  });
  it('should create ./test-downloads dir', async () => {
    const dirName = './test-downloads';
    const fileWriter = new FileWriter(dirName, transport, 'transfer');
    let errMessage = '';
    try {
      fs.statSync(dirName);
    } catch (err) {
      errMessage = err.message;
    }
    fs.rmdirSync(dirName);
    expect(errMessage).to.be.eq('');
  });
  it('should exec without err', async () => {
    const dirName = './downloads';
    const fileWriter = new FileWriter(dirName, transport, 'transfer');
    let errMessage = '';
    try {
      await fileWriter.exec();
    } catch (err) {
      errMessage = err.message;
    }
    fs.rmdirSync(dirName);
    expect(errMessage).to.be.eq('');
  });
});
