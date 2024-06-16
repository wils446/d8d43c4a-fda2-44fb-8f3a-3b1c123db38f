// Terdapat dua buah array yaitu array INPUT dan array QUERY, silahkan tentukan berapa kali kata dalam QUERY terdapat pada array INPUT

const matchCount = (input, query) => {
	return query.map((word) => input.filter((text) => text === word).length);
};

const INPUT = ["xc", "dz", "bbb", "dz"];
const QUERY = ["bbb", "ac", "dz"];

console.log(matchCount(INPUT, QUERY));
