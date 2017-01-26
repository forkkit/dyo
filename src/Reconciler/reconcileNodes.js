/**
 * reconcile nodes
 *  
 * @param  {VNode}  newNode
 * @param  {VNode}  oldNode
 * @param  {number} newNodeType
 * @param  {number} oldNodeType
 */
function reconcileNodes (newNode, oldNode, newNodeType, oldNodeType) {	
	// if newNode and oldNode, exit early
	if (newNode === oldNode) {
		return;
	}

	// extract node from possible component node
	var currentNode = newNodeType === 2 ? extractComponentNode(newNode) : newNode;

	// a component
	if (oldNodeType === 2) {
		// retrieve components
		var oldComponent = oldNode.instance;
		var newComponent = newNode.instance;

		// retrieve props
		var newProps = newComponent.props;
		var newState = newComponent.state;

		// component with shouldComponentUpdate
		if (
			oldComponent.shouldComponentUpdate !== void 0 && 
			componentUpdateBoundary(oldComponent, 'shouldComponentUpdate', newProps, newState) === false
		) {
			// exit early
			return;
		}

		// component with componentWillUpdate
		if (oldComponent.componentWillUpdate !== void 0) {
			componentUpdateBoundary(oldComponent, 'componentWillUpdate', newProps, newState);
		}
	}

	// children
	var newChildren = currentNode.children;
	var oldChildren = oldNode.children;

	// children length
	var newLength = newChildren.length;
	var oldLength = oldChildren.length;

	// no children
	if (newLength === 0) {
		// remove all children if old children is not already cleared
		if (oldLength !== 0) {
			oldNode.DOMNode.textContent = '';
			oldNode.children = newChildren;
		}
	}
	// has children
	else {
		// new node has children
		var parentNode = oldNode.DOMNode;

		// when keyed, the position that dirty keys begin
		var pos = 0;

		// non-keyed until the first dirty key is found
		var keyed = false;

		// un-initialized key hash maps
		var oldKeys;
		var newKeys;

		var newKey;
		var oldKey;

		// the highest point of interest
		var length = newLength > oldLength ? newLength : oldLength;

		// children nodes
		var newChild;
		var oldChild;

		// children types
		var newType;
		var oldType;

		// for loop, the end point being which ever is the 
		// greater value between new length and old length
		for (var i = 0; i < length; i++) {
			// avoid accessing out of bounds index and nodeType where unnecessary
			newType = i < newLength ? (newChild = newChildren[i]).Type : (newChild = nodeEmpty, 0);
			oldType = i < oldLength ? (oldChild = oldChildren[i]).Type : (oldChild = nodeEmpty, 0);

			if (keyed) {
				// push keys
				if (newType !== 0) {
					newKeys[newKey = newChild.props.key] = (
						newChild.index = i, 
						newChild.key = newKey, 
						newChild
					);
				}

				if (oldType !== 0) {
					oldKeys[oldKey = oldChild.props.key] = (
						oldChild.index = i, 
						oldChild.key = oldKey, 
						oldChild
					);
				}
			}
			// remove
			else if (newType === 0) {
				oldLength--;

				removeNode(oldType, oldChildren.pop(), parentNode);
			}
			// add
			else if (oldType === 0) {
				appendNode(
					newType, 
					oldChildren[oldLength++] = newChild, 
					parentNode, 
					createNode(newChild, null, null)
				);
			}
			// text
			else if (newType === 3 && oldType === 3) {
				if (newChild.children !== oldChild.children) {
					oldChild.DOMNode.nodeValue = oldChild.children = newChild.children;
				}
			}
			// key
			else if ((newKey = newChild.props.key) !== (oldKey = oldChild.props.key)) {
				keyed = true; 
				pos = i;
				oldKeys = {}; 
				newKeys = {};

				// push keys
				newKeys[newKey] = (newChild.index = i, newChild.key = newKey, newChild);
				oldKeys[oldKey] = (oldChild.index = i, oldChild.key = oldKey, oldChild);
			}
			// replace
			else if (newChild.type !== oldChild.type) {
				replaceNode(
					newType, 
					oldType, 
					oldChildren[i] = newChild, 
					oldChild, 
					parentNode, 
					createNode(newChild, null, null)
				);
			}
			// noop
			else {
				reconcileNodes(newChild, oldChild, newType, oldType);
			}
		}

		// reconcile keyed children
		if (keyed) {
			// new and old keys object are of differing shapes
			reconcileKeys([newKeys, oldKeys], parentNode, newNode, oldNode, newLength, oldLength, pos);
		}
	}

	// props objects of the two nodes are not equal, patch
	if (currentNode.props !== oldNode.props) {
		patchProps(currentNode, oldNode);
	}

	// component with componentDidUpdate
	if (oldNodeType === 2 && oldComponent.componentDidUpdate !== void 0) {
		componentUpdateBoundary(oldComponent, 'componentDidUpdate', newProps, newState);
	}
}

