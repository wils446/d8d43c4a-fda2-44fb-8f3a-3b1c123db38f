// Diberikan contoh sebuah kalimat, silahkan cari kata terpanjang dari kalimat tersebut, jika ada kata dengan panjang yang sama silahkan ambil salah satu

const longest = (text) => {
	const wordLength = text.split(" ").map((word) => word.length);

	return Math.max(...wordLength) + " characters";
};

const sentence = "Saya sangat senang mengerjakan soal algoritma";

console.log(longest(sentence));
