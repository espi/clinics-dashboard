import patients from '../../../../pages/api/patients/[id]'

test('processes CSV correctly', () => {
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

  patients(req, res);

  expect(json.mock.calls[0][0][0]).toEqual(['id', 'clinic_id', 'first_name', 'last_name', 'date_of_birth']);
  expect(json.mock.calls[0][0].length).toBeGreaterThan(1);
});