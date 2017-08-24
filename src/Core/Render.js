/**
 * @param {Element} subject
 * @param {Node} target
 */
function render (subject, target) {
	if (!isValidElement(subject))
		return render(commitElement(subject), target)
	
	if (!target)
		return render(subject, DOMRoot())
		
	if (root.has(target))
		return reconcileElement(root.get(target), commitElement(subject))

	mount(subject, elementIntermediate(DOM(target)), target)	
}

/**
 * @param {Element} subject
 * @param {Element} parent
 * @param {Node} target
 */
function mount (subject, parent, target) {
	if (!DOMValid(target))
		return invariant('render', 'Target container is not a DOM element')

	root.set(target, subject)

	commitContent(parent)
	commitMount(subject, subject, parent, parent, 0)
}
