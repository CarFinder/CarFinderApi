import * as chai from 'chai';
import { assert, expect } from 'chai';
import * as request from 'request-promise';
import * as sinon from 'sinon';
import { Api } from '../src/parsers/';

import puppeteer = require('puppeteer');

describe.only('Onliner Parser', () => {
  const api = new Api(1);
  const parser = {
    ADS: {
      advertisements: {
        '1': {
          car: {
            body: 5,
            model: {
              id: '1',
              name: 'X5 M'
            },
            odometerState: 198000,
            year: 2011
          },
          id: 1,
          photos: [] as any[]
        },
        '2': {
          car: {
            body: 5,
            model: {
              id: '2',
              name: 'X3'
            },
            odometerState: 52200,
            year: 2010
          },
          id: 2,
          photos: [] as any[]
        }
      },
      content: `
        <tr class="carRow">
          <td class="txt">
            <p>внедорожник, бензин 3.7 л
            </p>
          </td>
          <td>
            <div class="cost-i">
              <p class="small">7000 $<br>6018 €<br></p>
            </div>
          </td>
        </tr>
        <tr class="carRow">
          <td class="txt">
            <p>внедорожник, бензин 3.7 л
            </p>
          </td>
          <td>
            <div class="cost-i">
              <p class="small">8000 $<br>7018 €<br></p>
            </div>
          </td>
        </tr>
      `
    },
    ADS_RESULT: '',
    BODY_TYPES: `
      <li class="body_type-1">
        <label>
          <input type="checkbox" name="body_type[]" class="f-cb" value="1" />
          Седан&nbsp;<small class="count"></small>
        </label>
      </li>
      <li class="body_type-2">
        <label>
          <input type="checkbox" name="body_type[]" class="f-cb" value="2" />
          Универсал&nbsp;<small class="count"></small>
        </label>
      </li>
    `,
    BODY_TYPES_RESULT: ['Седан', 'Универсал'],
    MARKS: `var Manufactures = [{"id":1,"name":"Acura"},{"id":139,"name":"Adler"}];`,
    MARKS_RESULT: [{ id: 1, name: 'Acura' }, { id: 139, name: 'Adler' }],
    MODELS: `var ManufacturesModel = {"183":[{"'33 Hot Rod":"2581"},{"818":"2583"}]};`,
    MODELS_RESULT: { '183': [{ "'33 Hot Rod": '2581' }, { '818': '2583' }] }
  };

  it('should be return an array of marks', async () => {
    const puppeteerStub = sinon.stub(puppeteer, 'launch').returns({
      close: () => '',
      newPage: () => ({
        content: () => parser.MARKS,
        goto: (url: string, options: any) => ''
      })
    });
    await api.updateMarks();
    assert.deepEqual(api.getMarks() as any, parser.MARKS_RESULT);
    puppeteerStub.restore();
  });

  it('should be return an array of models', async () => {
    const puppeteerStub = sinon.stub(puppeteer, 'launch').returns({
      close: () => '',
      newPage: () => ({
        content: () => parser.MODELS,
        goto: (url: string, options: any) => ''
      })
    });
    await api.updateModels();
    assert.deepEqual(api.getModels() as any, parser.MODELS_RESULT);
    puppeteerStub.restore();
  });

  it('should be return an array of body types', async () => {
    const puppeteerStub = sinon.stub(puppeteer, 'launch').returns({
      close: () => '',
      newPage: () => ({
        content: () => parser.BODY_TYPES,
        goto: (url: string, options: any) => ''
      })
    });
    await api.updateBodyTypes();
    assert.deepEqual(api.getBodyTypes() as any, parser.BODY_TYPES_RESULT);
    puppeteerStub.restore();
  });

  it('should be return an array of ads', async () => {
    const requestStub = sinon.stub(request, 'post').returns((opts: any) => {
      return opts.formData.page === 1 ? { result: parser.ADS } : null;
    });
    await api.updateAds(1);
    console.log(api.getAds());
    requestStub.restore();
  });
});
