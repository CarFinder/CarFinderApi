import * as chai from 'chai';
import { assert, expect } from 'chai';
import * as request from 'request-promise';
import * as sinon from 'sinon';
import { Api } from '../src/parsers/';

describe('Av.by Parser', () => {
  const api = new Api(2);
  const parser = {
    ADS: `
      <div class="listing-item-image-in">
        <a href="url"></a>
      </div>
      <div class="card-price-approx">14 600</div>
      <div class="card-info">
        <dd>2010</dd>
        <dd>с пробегом</dd>
        <dd>62000 км</dd>
        <dd>бензин</dd>
        <dd>2300 см</dd>
        <dd>серый</dd>
        <dd>внедорожник</dd>
        <dd>Автомат</dd>
      </div>
      <li class="card-about-item-dates">
          <dd>05.10.2017</dd>
          <dd>16.11.2017</dd>
      </li>
      <div class="js-card-description">
        <p>description</p>
      </div>
      <div class="fotorama">
        <a href="image"></a>
      </div>`,
    ADS_RESULT: [
      {
        bodyType: 'Внедорожник',
        creationDate: new Date(2017, 9, 5),
        description: 'description',
        images: ['image'],
        kms: 62000,
        lastTimeUpDate: new Date(2017, 10, 16),
        model: 'name',
        price: 14600,
        sourceName: 'av.by',
        sourceUrl: 'url',
        year: 2010
      }
    ],
    BODY_TYPES: `
      <select id="body_id">
        <option>Выберите тип кузова</option>
        <option>внедорожник</option>
        <option>не внедорожник</option>
        <option>другой</option>
      </select>`,
    BODY_TYPES_RESULT: ['внедорожник', 'не внедорожник'],
    MARKS: `
      <ul class="brandslist">
        <li class="brandsitem brandsitem--primary">
            <a href="https://cars.av.by/acura">
              <span>Acura</span> <small>73</small>
            </a>
        </li>
        <li class="brandsitem brandsitem--primary">
            <a href="https://cars.av.by/alfa-romeo">
              <span>Alfa Romeo</span> <small>222</small>
            </a>
        </li>
        <li class="brandsitem">
          <a href="#" title="Показать все">...</a>
        </li>
      </ul>`,
    MARKS_RESULT: [
      {
        name: 'Acura',
        url: 'https://cars.av.by/acura'
      },
      {
        name: 'Alfa Romeo',
        url: 'https://cars.av.by/alfa-romeo'
      }
    ],
    MODELS: `
      <ul class="brandslist">
        <li class="brandsitem brandsitem--primary">
          <a href="https://cars.av.by/acura/mdx">
            <span>MDX</span> <small>24</small>
          </a>
        </li>
        <li class="brandsitem brandsitem--primary">
          <a href="https://cars.av.by/acura/rdx">
            <span>RDX</span> <small>11</small>
          </a>
        </li>
      </ul>`,
    MODELS_RESULT: [
      {
        Acura: [
          { name: 'MDX', url: 'https://cars.av.by/acura/mdx' },
          { name: 'RDX', url: 'https://cars.av.by/acura/rdx' }
        ]
      },
      {
        'Alfa Romeo': [
          { name: 'MDX', url: 'https://cars.av.by/acura/mdx' },
          { name: 'RDX', url: 'https://cars.av.by/acura/rdx' }
        ]
      }
    ]
  };

  let requestStub: sinon.SinonStub;

  afterEach(done => {
    if (requestStub) {
      requestStub.restore();
    }
    done();
  });

  it('should be return an array of marks', async () => {
    requestStub = sinon.stub(request, 'get').callsFake((opts: any) => parser.MARKS);
    await api.updateMarks();
    assert.deepEqual(api.getMarks() as any, parser.MARKS_RESULT);
  });

  it('should be return an array of models', async () => {
    requestStub = sinon
      .stub(request, 'get')
      .callsFake((opts: any) => new Promise(resolve => resolve(parser.MODELS)));
    await api.updateModels();
    assert.deepEqual(api.getModels() as any, parser.MODELS_RESULT);
  });

  it('should be return an array of body types', async () => {
    requestStub = sinon.stub(request, 'get').callsFake((opts: any) => parser.BODY_TYPES);
    await api.updateBodyTypes();
    assert.deepEqual(api.getBodyTypes() as any, parser.BODY_TYPES_RESULT);
  });

  it('should be return an array of ads', async () => {
    requestStub = sinon
      .stub(request, 'get')
      .callsFake((opts: any) => new Promise(resolve => resolve(parser.ADS)));
    await api.updateAds({ url: 'url', name: 'name' });
    assert.deepEqual(api.getAds(), parser.ADS_RESULT);
  });
});
