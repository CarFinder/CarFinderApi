import * as chai from 'chai';
import { assert, expect } from 'chai';
import * as request from 'request-promise';
import * as sinon from 'sinon';
import { Api } from '../src/parsers/';

describe('Onliner Parser', () => {
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
            <p>внедорожник, бензин 3.7 л</p>
          </td>
          <td>
            <span class="price-primary">7000</span>
          </td>
        </tr>
        <tr class="carRow">
          <td class="txt">
            <p>внедорожник, бензин 3.7 л</p>
          </td>
          <td>
            <span class="price-primary">8000</span>
          </td>
        </tr>
      `
    },
    ADS_RESULT: {
      '1': {
        car: { body: 5, model: { id: '1', name: 'X5 M' }, odometerState: 198000, year: 2011 },
        description: 'внедорожник, бензин 3.7 л',
        id: 1,
        photos: [] as any[],
        price: 7000
      },
      '2': {
        car: { body: 5, model: { id: '2', name: 'X3' }, odometerState: 52200, year: 2010 },
        description: 'внедорожник, бензин 3.7 л',
        id: 2,
        photos: [] as any[],
        price: 8000
      }
    },
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

  let requestStub: sinon.SinonStub;

  afterEach(() => {
    requestStub.restore();
  });

  it('should be return an array of marks', async () => {
    requestStub = sinon.stub(request, 'get').callsFake((opts: any) => parser.MARKS);
    await api.updateMarks();
    assert.deepEqual(api.getMarks() as any, parser.MARKS_RESULT);
  });

  it('should be return an array of models', async () => {
    requestStub = sinon.stub(request, 'get').callsFake(async (opts: any) => await parser.MODELS);
    await api.updateModels();
    assert.deepEqual(api.getModels() as any, parser.MODELS_RESULT);
  });

  it('should be return an array of body types', async () => {
    requestStub = sinon.stub(request, 'get').callsFake((opts: any) => parser.BODY_TYPES);
    await api.updateBodyTypes();
    assert.deepEqual(api.getBodyTypes() as any, parser.BODY_TYPES_RESULT);
  });

  it('should be return an array of ads', async () => {
    requestStub = sinon.stub(request, 'post').callsFake((opts: any) => {
      return opts.formData.page === 1
        ? { result: parser.ADS }
        : { result: { advertisements: null, content: null } };
    });
    await api.updateAds(1);
    assert.deepEqual(api.getAds(), parser.ADS_RESULT);
  });
});
