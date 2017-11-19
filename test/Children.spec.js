describe('Children', () => {
	let {map, only, count, forEach, toArray, find, filter} = Children
	let index = 0
	let element = h('h1', '1')

	it('should convert toArray children', () => {
		assert.deepEqual(toArray(null), [])
		assert.deepEqual(toArray({
			[Symbol.iterator]: function* () {
		    yield 1
		    yield 2
		    yield 3
			}
		}), [1, 2, 3])

		assert.deepEqual(toArray([1, '2', true]), [1, '2', true], 'toArray([])')
		assert.deepEqual(toArray([1, '2', [true]]), [1, '2', true], 'toArray([nested])')
		assert.deepEqual(toArray('string'), ['string'], 'toArray(string)')
		assert.deepEqual(toArray(1), [1], 'toArray(number)')
		assert.deepEqual(toArray({}), [{}], 'toArray(Object)')
		assert.equal(toArray(element)[0], element, 'toArray(element)')
		assert.equal(toArray(h('h1', 1, 2, 3).children).length, 3, 'toArray(element.children)')
	})

	it('should map children', () => {
		assert.equal(map(null), null)
		assert.deepEqual(map([1, [2, 3]], x => x+1), [2, 3, 4], 'map([])')
		assert.deepEqual(map(1, x => x+1), [2], 'map(number)')
		assert.deepEqual(map('1', x => x+1), ['11'], 'map(string)')
		assert.equal(map(element, x => x)[0], element, 'map(element)')
	})

	it('should forEach children', () => {
		forEach([1, [2, 3]], (x) => index += x)
		assert.equal(index, 6, 'forEach([])')

		forEach(1, (x) => index += x)
		assert.equal(index, 7, 'forEach(number)')

		forEach('1', (x) => index += x)
		assert.equal(index, '71', 'forEach(string)')

		forEach(element, (x) => index = x)
		assert.equal(index, element, 'forEach(element)')

		forEach(null, (x) => index = x)
		assert.equal(index, element, 'forEach(null)')
	})

	it('should count children', () => {
		assert.equal(count([]), 0, 'count([])')
		assert.equal(count([1, [2, 3]]), 3, 'count([3])')
	})

	it('should only accept one child', () => {
		assert.equal(only(element), element, 'only(element)')
		assert.throws(only, '#Children.only(...): Expected to receive a single element.')
	})

	it('should filter children', () => {
		assert.equal(filter(null), null)
		assert.deepEqual(filter([1, [2, 3]], x => x > 1), [2, 3], 'filter([])')
		assert.deepEqual(filter(1, x => x === 1), [1], 'filter(number)')
		assert.deepEqual(filter('1', x => x !== '1'), [], 'filter(string)')
		assert.equal(filter(element, x => x === element)[0], element, 'filter(element)')
	})

	it('should find children', () => {
		assert.equal(find(null), null)
		assert.equal(find([1, 2, 3], x => x === NaN), undefined)
		assert.equal(find([1, [2, 3]], x => x === 3), 3, 'find([])')
		assert.equal(find(1, x => x === 1), 1, 'find(number)')
		assert.equal(find('1', x => x === '1'), '1', 'find(string)')
		assert.equal(find(element, x => x === element), element, 'find(element)')

		let defaultFind = Array.prototype.find

		Object.defineProperty(Array.prototype, 'find', {value: undefined})

		assert.equal(find([1, [2, 3]], x => x === 3), 3, 'find([])')

		Object.defineProperty(Array.prototype, 'find', {value: defaultFind})

		assert.equal(Array.prototype.find, defaultFind)
	})
})
