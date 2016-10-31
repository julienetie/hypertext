import { assembly } from '../../src/assembly';
const div = assembly('div');

function VirtualText(text) {
	this.text = text + '';
}
// VirtualText.prototype.version = '2';
// VirtualText.prototype.type = "VirtualText";


const divWithKey = div({ class: 'some-button', key: '12345' });
const divWithEvent = div({ class: 'some-button', event: 'click-button' });

describe('assembly', () => {

	it('Should be a function', () => {
		expect(assembly).to.be.a('function');
	});

	it('Should uppercase tagName', () => {
		expect(div().tagName).to.equal('DIV');
	});

	it('Should return a virtual text node for a given string', () => {
		const testString = 'Hello World!';
		const vText = new VirtualText(testString).text;
		const virtualNode = div(testString).children[0].text;
		expect(virtualNode).to.equal(vText);
	});

	it('Should return a virtual text node for a given number', () => {
		const testNumber = 12345;
		const vText = new VirtualText(testNumber).text;
		const virtualNode = div(testNumber).children[0].text;
		expect(virtualNode).to.equal(vText);
	});

	it('Should return a virtual node with property "virtualNode"', () => {

		expect(div()).to.have.property('virtualNode')
	});

	it('Should reurn a virtual node without "properties" event property, when supplied an event', () => {
		expect(divWithEvent.properties).to.not.have.property('event');
	});

	it('Should reurn a virtual node with an event property when supplied an event', () => {
		expect(divWithEvent).to.have.property('event');
	});

	it('Should produce a virtual node when an empty attribute object is supplied', () => {
		expect(div({})).to.be.ok;
	});


	it('Should return a virtual node with children for a given array of virtual nodes', () => {
		const parentWithChildren = div([div('Some text'), div(), div()]);
		expect(parentWithChildren.children).to.be.an('array');
		parentWithChildren.children.forEach((childVirtualNode) => {
			expect(childVirtualNode).to.have.property('virtualNode');
		});
	});

	it('Should reurn a virtual node without "properties" key property, when supplied a key', () => {
		expect(divWithKey.properties).to.not.have.property('key');
	});

	it('Should reurn a virtual node with a key property when supplied a key', () => {
		expect(divWithKey).to.have.property('key');
	});

	// it('Should reurn a virtual node with the supplied namespace', () => {
	// 	expect(true).to.equal(false);
	// });

	// it('Should treat all objects containing "virtualNode" property as children', () => {
	// 	expect(true).to.equal(false);
	// });

});
