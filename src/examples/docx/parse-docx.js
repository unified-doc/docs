export default function Parser(file) {
  function parse() {
    console.log(file);
  }

  return {
    parse,
  };
}
