const matrixSubtraction = (matrix) => {
	let firstDiagonal = 0;
	let secondDiagonal = 0;

	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (i === j) firstDiagonal += matrix[i][j];
			if (j === matrix[i].length - i - 1) secondDiagonal += matrix[i][j];
		}
	}

	console.log(firstDiagonal, secondDiagonal);
	return firstDiagonal - secondDiagonal;
};

const Matrix = [
	[1, 2, 0],
	[4, 5, 6],
	[7, 8, 9],
];

console.log(matrixSubtraction(Matrix));
