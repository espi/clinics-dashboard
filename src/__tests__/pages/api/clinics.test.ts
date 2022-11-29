import clinics from '../../../pages/api/clinics'

test('Processes CSV correctly', () => {
  const req = {
    query: {
      id: 1
    }
  }

  const json = jest.fn();

  const status = jest.fn(() => {
    return {
      json
    }
  })

  const res = {
    status
  }

  clinics(req, res);

  expect(json.mock.calls[0][0][0]).toEqual(['id', 'name']);
  expect(json.mock.calls[0][0].length).toBeGreaterThan(1);
});