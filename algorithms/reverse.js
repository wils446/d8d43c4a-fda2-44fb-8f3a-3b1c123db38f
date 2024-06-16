// Terdapat string "NEGIE1", silahkan reverse alphabet nya dengan angka tetap diakhir kata Hasil = "EIGEN1"

const reverse = (str) => {
	let numString = "";

	reversedStr = str
		.split("")
		.filter((char) => {
			if (!isNaN(+char)) {
				numString += char;
				return false;
			}
			return true;
		})
		.reverse()
		.join("");

	return reversedStr + numString;
};

console.log(reverse("NEGIE1"));
