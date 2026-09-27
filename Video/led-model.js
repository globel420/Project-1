/* Pure display rules, shared by the page and its validation. */
(function(root) {
  const weights = [16, 8, 4, 2, 1];
  function buildNumber(value) {
    if (!Number.isInteger(value) || value < 0 || value > 31) throw new RangeError('Choose a whole number from 0 to 31.');
    let remaining = value;
    const selected = [];
    return weights.map((weight, index) => {
      const before = remaining;
      const on = weight <= remaining;
      if (on) { remaining -= weight; selected.push(weight); }
      return { index, weight, before, on, remaining, selected: [...selected], built: value - remaining };
    });
  }
  function binarySteps(value) {
    if (!Number.isInteger(value) || value < 0 || value > 31) throw new RangeError('Choose a whole number from 0 to 31.');
    return [12,11,10,9,8].map((pin,i) => ({i,pin,weight:2**i,bit:(value>>i)&1}));
  }
  function evaluate(a, b) {
    a = Boolean(a); b = Boolean(b);
    return { a, b, not: !a, and: a && b, or: a || b, xor: a !== b };
  }
  const api = { weights, buildNumber, binarySteps, evaluate };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LedModel = api;
})(typeof window === 'object' ? window : globalThis);
