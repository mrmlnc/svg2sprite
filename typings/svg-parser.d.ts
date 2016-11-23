declare module "svg-parser" {

	namespace svgParser {
		interface INode {
			name: string;
			attributes: { [attribute: string]: string };
			children: INode[];
			metadata?: string;
		}

		function parse(content: string): INode;
	}

	export = svgParser;

}
