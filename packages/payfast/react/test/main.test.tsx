/* eslint-disable camelcase */
import { test, expect } from "vitest";
import renderer from 'react-test-renderer'
import {ReactPayfast} from '../lib';
import { nanoid } from "nanoid";
function toJson(component: renderer.ReactTestRenderer) {
  const result = component.toJSON()
  expect(result).toBeDefined()
  expect(result).not.toBeInstanceOf(Array)
  return result as renderer.ReactTestRendererJSON
}
const buildOptions = (m_payment_id: string, notify_url: string) => ({
  merchant: {
    merchant_id: '10000100',
    merchant_key: '46f0cd694581a',
    return_url:  '/success',
    cancel_url: '/success',
    notify_url,
  },
  customer: {
    name_first: 'Test',
    name_last: 'Test',
    email_address: 'test@test.com',
  },
  transaction: {
    m_payment_id,
    amount: 100,
    item_name: 'cookies',
    item_description: 'a bag of cookies',
  },
});
const options = buildOptions(nanoid(), 'url')
test('MyEpicLibraryComponent renders succesfully', () => {
  const component = renderer.create(
    <ReactPayfast {...options}/>,
  )
  const tree = toJson(component)
  expect(tree).toMatchSnapshot()
})