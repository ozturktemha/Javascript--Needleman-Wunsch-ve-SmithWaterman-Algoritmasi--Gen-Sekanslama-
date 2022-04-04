seq1 = '';
seq2 = '';

matchScore = 0;
missmatchScore = 0;
gapScore = 0;
gc = "-";



let btn = document.getElementById("btn");
const table = document.getElementById('table');
btn.onclick = function () {

    seq1 = document.getElementById("seq_1").value;
    seq2 = document.getElementById("seq_2").value;

    matchScore = document.getElementById("matchScore").value;
    missmatchScore = document.getElementById("mismatchScore").value;
    gapScore = document.getElementById("gapScore").value;

    let alg = document.getElementById("alg").value;
    console.log('alg:', alg);


    console.log(alg, seq1, seq2, matchScore, missmatchScore, gapScore);

    if (!alg || !seq1 || !seq2 || !matchScore || !missmatchScore || !gapScore) {
        alert('Boş değer bırakmayın kardeşim');
        return;
    }

    seq1 = seq1.toUpperCase();
    seq2 = seq2.toUpperCase();
    matchScore = Number.parseInt(matchScore);
    missmatchScore = Number.parseInt(missmatchScore);
    gapScore = Number.parseInt(gapScore);


    if (alg == 'NW') {
        n();
    } else {
        s();
    }
}

function renderTable(seq1, seq2) {

    content = '<tr>' + seq1.map(el => `<td>${el}</td>`).join('') + '</tr>';
    
    
    content += '<tr>'
    matches = 0;
    for (let i in seq1) {
        content += '<td>' + (seq1[i] == seq2[i] ? '|' : '') + '</td>';

        if (seq1[i] == seq2[i]) {
            matches++;
        }
    }
    content += '</tr>';


    content += '<tr>' + seq2.map(el => `<td>${el}</td>`).join('') + '</tr>';
    

    console.log('toplam', seq1.length);
    console.log('eşleşen', matches);

    let Identity = (matches / seq1.length)*100;
    Identity=Identity.toFixed(4);

    let alg = document.getElementById("alg").value;
    

    if (alg == 'NW') {
        document.getElementById("name").innerHTML = "Needleman Wunsch algoritması";
        table.innerHTML = content;
        document.getElementById("scors").innerHTML ="Total Alignment Score :"+ nscor  + " </br> " + "("+ 
        "MATCH SCORE = " +  matchScore + ","+ " " + "MİSMATCH SCORE = "+ missmatchScore + ","+" " +
        "Gap Open Penalty/Gap Extension Penalty =" + gapScore + ")"+ " </br> " + " </br> " + 
        "Identity="+ "%" +Identity + " "+ "("+ "matches ="+ matches + "," +" "  + "Sequence Length=" + seq1.length + ")";
        
    } else {
        document.getElementById("name").innerHTML = "Smith Waterman algoritması";
        table.innerHTML = content;
        document.getElementById("scors").innerHTML = "Total Alignment Score :"+ sscor  + " </br> " + "("+ 
        "MATCH SCORE = " +  matchScore + ","+ " " + "MİSMATCH SCORE = "+ missmatchScore + ","+" " +
        "Gap Open Penalty/Gap Extension Penalty =" + gapScore + ")"+ " </br> " + " </br> " + 
        "Identity="+ "%" +Identity + " "+ "("+ "matches ="+ matches + "," +" "  + "Sequence Length=" + seq1.length + ")";
    }

    document.getElementById('table','p').style.display = ''
}


function n() {
    console.log('nw basladi');
    let matrix = new Array(seq1.length + 1).fill(0);
    matrix = matrix.map(el => new Array(seq2.length + 1).fill(0));

    console.log(5);
    for (let i = 0; i < matrix.length; i++) {
        matrix[i][0] = gapScore * i;
    }

    console.log(4);

    for (let i = 0; i < matrix[0].length; i++) {
        matrix[0][i] = gapScore * i;
    }

    console.log(3);

    for (let i = 1; i < matrix.length; i++) { //seq1
        for (let j = 1; j < matrix[i].length; j++) { //seq2
            let letter1 = seq1[i - 1];
            let letter2 = seq2[j - 1];

            let leftUp = ((letter1 == letter2) ? matchScore : missmatchScore);

            let diagonal = matrix[i - 1][j - 1] + leftUp;
            let left = matrix[i][j - 1] + gapScore;
            let up = matrix[i - 1][j] + gapScore;
            matrix[i][j] = Math.max(diagonal, left, up);

            if (i == matrix.length - 1 & j == matrix[i].length - 1) {
                nscor = matrix[i][j];

            }

        }
    }

    let i = seq1.length;
    let j = seq2.length;
    let sq1 = [];
    let sq2 = [];

    console.log(1);

    do {

        let letter1 = seq1[i - 1];
        let letter2 = seq2[j - 1];

        let leftUp = ((letter1 == letter2) ? matchScore : missmatchScore);

        let diagonal = matrix[i - 1][j - 1] + leftUp;
        let left = matrix[i][j - 1] + gapScore;
        let up = matrix[i - 1][j] + gapScore;
        matrix[i][j] = Math.max(diagonal, left, up);

        let t = up;
        let d = diagonal;
        let l = left;
        let max = Math.max(t, d, l);

        switch (max) {
            case t:
                i--;
                sq2.push(gc);
                sq1.push(seq1[i]);

                break;
            case d:
                j--;
                i--;
                sq1.push(seq1[i]);
                sq2.push(seq2[j]);

                break;
            case l:
                j--;
                sq2.push(seq2[j]);
                sq1.push(gc);

                break;
        }

    } while (i > 0 && j > 0);

    console.log(2);

    console.table(matrix);
    console.log(nscor);

    console.log(sq1.reverse());
    console.log(sq2.reverse());


    renderTable(sq1, sq2);

}

function s() {
    let smatrix = new Array(seq1.length + 1).fill(0);
    smatrix = smatrix.map(el => new Array(seq2.length + 1).fill(0));

    for (let i = 0; i < smatrix.length; i++) {
        smatrix[i][0] = 0;
    }

    for (let i = 0; i < smatrix[0].length; i++) {
        smatrix[0][i] = 0;
    }


    for (let i = 1; i < smatrix.length; i++) { //seq1
        for (let j = 1; j < smatrix[i].length; j++) { //seq2
            let letter1 = seq1[i - 1];
            let letter2 = seq2[j - 1];

            let sleftUp = ((letter1 == letter2) ? matchScore : missmatchScore);

            let sdiagonal = smatrix[i - 1][j - 1] + sleftUp;
            let sleft = smatrix[i][j - 1] + gapScore;
            let sup = smatrix[i - 1][j] + gapScore;
            smatrix[i][j] = Math.max(sdiagonal, sleft, sup, 0);

        }
    }
    console.table(smatrix);

    let i = 0;
    let j = 0;
    let max = 0;

    for (const rowIndex in smatrix) {
        for (const columnIndex in smatrix[rowIndex]) {
            if (smatrix[rowIndex][columnIndex] > max) {
                max = smatrix[rowIndex][columnIndex];
                i = rowIndex;
                j = columnIndex;
            }
        }
    }

    console.log(max, i, j);
    sscor = max;

    let ssq1 = [];
    let ssq2 = [];


    do {

        let letter1 = seq1[i - 1];
        let letter2 = seq2[j - 1];

        let leftUp = ((letter1 == letter2) ? matchScore : missmatchScore);

        let diagonal = smatrix[i - 1][j - 1] + leftUp;
        let left = smatrix[i][j - 1] + gapScore;
        let up = smatrix[i - 1][j] + gapScore;

        smatrix[i][j] = Math.max(diagonal, left, up);

        let t = up;
        let d = diagonal;
        let l = left;
        let max = Math.max(t, d, l);

        switch (max) {
            case t:
                i--;
                ssq2.push(gc);
                ssq1.push(seq1[i]);

                break;
            case d:
                j--;
                i--;
                ssq1.push(seq1[i]);
                ssq2.push(seq2[j]);

                break;
            case l:
                j--;
                ssq2.push(seq2[j]);
                ssq1.push(gc);

                break;
        }

    } while (i > 0 && j > 0);

    console.log(sscor);
    console.log(ssq1.reverse());
    console.log(ssq2.reverse());

    renderTable(ssq1, ssq2);

}