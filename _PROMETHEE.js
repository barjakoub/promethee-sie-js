const datas = [
  {
    nama: 'ninis',
    K1: 4,
    K2: 1,
    K3: 3
  },
  {
    nama: 'ali',
    K1: 3,
    K2: 2,
    K3: 2
  },
  {
    nama: 'husein',
    K1: 2,
    K2: 3,
    K3: 1
  },
  {
    nama: 'husni',
    K1: 1,
    K2: 4,
    K3: 4
  },
  {
    nama: 'wahab',
    K1: 0,
    K2: 5,
    K3: 5
  },
];
/* Nilai _FINAL masing-masing kandidat */
let _FINALS = [];
let _LEAVINGFLOWS = [];

for (let data of datas) {
  /* konstanta referensi */
  const _PREFERENSI = 1 / 3;
  /* K1 */
  const candK1 = data.K1;
  /* nilai preferensi K1 tiap kandidat */
  let preferensiK1 = [];
  for (let { nama, K1 } of datas) {
    if (K1 === data.K1) {
      continue;
    }
    // console.info(`${nama}: ${K1}`);
    if (candK1 - K1 <= 0) {
      preferensiK1.push(0)
    } else {
      preferensiK1.push(1);
    }
  }
  console.info(`This is K1`);
  console.info(preferensiK1);
  /* K2 */
  const candK2 = data.K2;
  let preferensiK2 = [];
  for (let { nama, K2 } of datas) {
    if (K2 === candK2) {
      // console.info(`K2: ${K2} dan candK2: ${candK2}`);
      continue;
    }

    if (candK2 - K2 <= 0) {
      preferensiK2.push(0);
    } else {
      preferensiK2.push(1);
    }
  }
  console.info(`This is K2`);
  console.info(preferensiK2);
  /* K3 */
  const candK3 = data.K3;
  let preferensiK3 = [];
  for (let { nama, K3 } of datas) {
    if (K3 === candK3) {
      // console.info(`K2: ${K2} dan candK2: ${candK2}`);
      continue;
    }

    if (candK3 - K3 <= 0) {
      preferensiK3.push(0);
    } else {
      preferensiK3.push(1);
    }
  }
  console.info(`This is K3`);
  console.info(preferensiK3);

  /* NILAI PREFERENSI AKHIR */
  let _FINAL = [];
  for (let index = 0; index < preferensiK1.length; index++) {
    let totalNilaiKriteria = _PREFERENSI * (preferensiK1[index] + preferensiK2[index] + preferensiK3[index]);
    _FINAL.push(totalNilaiKriteria);
  }
  /* Nilai Leaving Flow Masing-Masing Kandidat */
  let _LEAVINGFLOW = 0;
  for (let final of _FINAL) {
    _LEAVINGFLOW += final;
  }
  console.info('FINAL: ' + _FINAL);
  console.info('Leaving Flow : ' + (1 / 2) * _LEAVINGFLOW);

  /* insert to _FINALS */
  _FINALS.push(_FINAL);

  /* insert to _LEAVINGFLOWS */
  _LEAVINGFLOWS.push(1 / 2 * _LEAVINGFLOW);
  /* belum dibagi 1/2 */
}

/* destruct _FINALS */
const [_FINAL1, _FINAL2, _FINAL3, _FINAL4, _FINAL5] = _FINALS;

/* ENTERING FLOW */
let _ENTERINGFLOWS = [];
const _EFKONSTANTA = 1 / 2;
for (let i = 0; i < _FINAL1.length; i++) {
  _ENTERINGFLOWS.push(_EFKONSTANTA * (_FINAL1[i] + _FINAL2[i] + _FINAL3[i] + _FINAL4[i] + _FINAL5[i]));
}

console.info(_FINALS);
console.info(_LEAVINGFLOWS);
console.info(_ENTERINGFLOWS);

// const newOb = datas[1];

// for(let person in newOb){
//     if(person == 'id'){
//         continue;
//     }
//     console.info(newOb[person]);
// }