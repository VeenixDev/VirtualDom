const fs = require('node:fs');
const http = require('node:http');

class DOMNode {
	constructor(parent, type, value, attributes, childNodes) {
		this.type = type;
		this.attributes = attributes||{};
		this.value = value;
		this.parent = parent;
		this.childNodes = childNodes||[];
		
		if(value && type) {
			new DOMNode(this, null, value);
		}
		
		parent?.addChildNode(this);
	}
	
	getChildNodes() {
		return this.childNodes.filter((e) => e.type != null);
	}
	
	addChildNode(child) {
		this.childNodes.push(child);
	}
	
	build() {
		let result = "";
		
		if(!this.type) {
			return this.value;
		}
		
		result += `<${this.type}`;
		for(let a in this.attributes) {
			result += ` ${a}="${this.attributes[a]}"`
		}
		result += ">"
		
		for(let child of this.childNodes) {
			result += child.build();
		}
		
		result += `</${this.type}>`
		return result;
	}
}

const DOM_ROOT = new DOMNode(null, "html", null, {lang: "en"});
const HEAD = new DOMNode(DOM_ROOT, "head");
const HEAD_TITLE = new DOMNode(HEAD, "title", "Virtual-Dom Test");

const BODY = new DOMNode(DOM_ROOT, "body");
const HELLO_WORLD_SPAN = new DOMNode(null, "span", "Hello World", {style: "background: rgb(255,0,0)"});
const BODY_DIV = new DOMNode(BODY, "div", "UwU");
BODY_DIV.addChildNode(HELLO_WORLD_SPAN);

console.log(BODY_DIV.getChildNodes());
return;

const server = http.createServer((req, res) => res.end(DOM_ROOT.build(), "UTF-8", () => console.log("Request ended")));

server.listen(80);
