const GAME_DEV_1 = {
  letters: 'ointr',
  words: new Map([
    ['tino', { origin: [1, 0], direction: 'horizontal' }],
    ['trino', { origin: [1, 0], direction: 'vertical' }],
    ['orin', { origin: [1, 4], direction: 'horizontal' }],
    ['intro', { origin: [4, 3], direction: 'vertical' }],
    ['rito', { origin: [2, 4], direction: 'vertical' }],
    ['oir', { origin: [4, 7], direction: 'horizontal' }],
    ['tio', { origin: [4, 5], direction: 'horizontal' }],
    ['rio', { origin: [0, 2], direction: 'horizontal' }],
    ['no', { origin: [1, 7], direction: 'horizontal' }],
    ['trio', { origin: [6, 3], direction: 'horizontal' }],
    ['nitro', { origin: [6, 1], direction: 'vertical' }],
    ['ir', { origin: [8, 3], direction: 'vertical' }]
  ])
}

const GAME_DEV_2 = {
  letters: 'spoal',
  words: new Map([
    ['sola', { origin: [3, 0], direction: 'horizontal' }],
    ['losa', { origin: [5, 0], direction: 'vertical' }],
    ['palo', { origin: [1, 2], direction: 'vertical' }],
    ['palos', { origin: [1, 2], direction: 'horizontal' }],
    ['posa', { origin: [0, 5], direction: 'horizontal' }],
    ['sapo', { origin: [3, 4], direction: 'vertical' }],
    ['sopa', { origin: [2, 7], direction: 'horizontal' }]
  ])
}

const GAME_DEV_3 = {
  letters: 'lasto',
  words: new Map([
    ['sal',  { origin: [3, 0], direction: 'horizontal'} ],
    ['alto', { origin: [4, 0], direction: 'vertical' }],
    ['tos',  { origin: [4, 2], direction: 'horizontal' } ],
    ['sol',   { origin: [6, 2], direction: 'vertical' } ],
    ['salto',  { origin: [0, 3], direction: 'horizontal' } ],
    ['sola',   { origin: [0, 3], direction: 'vertical' } ],
    ['altos',  { origin: [0, 6], direction: 'horizontal' } ],
    ['sota',   { origin: [1, 0], direction: 'vertical' } ],
    ['losa',   { origin: [6, 4], direction: 'horizontal' } ],
    ['las',  { origin: [9, 3], direction: 'vertical' } ],
    ['los',   { origin: [0, 1], direction: 'horizontal' } ]
  ])
}

const GAME_DEV_4 = {
  letters: 'latre',
  words: new Map([
    ['letra',    { origin: [1, 2], direction: 'horizontal' } ],
    ['telar', { origin: [3, 2], direction: 'vertical' } ],
    ['real',    { origin: [5, 3], direction: 'horizontal' } ],
    ['reta',   { origin: [0, 5], direction: 'horizontal' } ],
    ['arte',    { origin: [5, 2], direction: 'vertical' } ],
    ['tal',   { origin: [8, 1], direction: 'vertical' } ],
    ['te',   { origin: [8, 1], direction: 'horizontal' } ],
    ['era',   { origin: [5, 5], direction: 'horizontal' } ],
    ['ate', { origin: [7, 5], direction: 'vertical' } ],
    ['tela', { origin: [1, 0], direction: 'vertical' } ]
  ])
}

const GAME_DEV_5 = {
  letters: 'marto',
  words: new Map([
    ['mota',    { origin: [4, 0], direction: 'horizontal' } ],
    ['toma', { origin: [6, 0], direction: 'vertical' } ],
    ['mar',    { origin: [6, 2], direction: 'horizontal' } ],
    ['roma', { origin: [1, 2], direction: 'vertical' } ],
    ['arto', { origin: [3, 2], direction: 'vertical' } ],
    ['rota',    { origin: [3, 3], direction: 'horizontal' } ],
    ['mato',    { origin: [0, 5], direction: 'horizontal' } ],
    ['rato',    { origin: [8, 6], direction: 'vertical' } ],
    ['mora', { origin: [0, 5], direction: 'vertical' } ],
    ['tomar', { origin: [5, 3], direction: 'vertical' } ],
    ['amo', { origin: [7, 4], direction: 'vertical' } ],
    ['amor',    { origin: [5, 6], direction: 'horizontal' } ],
    ['ramo',    { origin: [0, 7], direction: 'horizontal' } ],
    ['tramo',    { origin: [4, 9], direction: 'horizontal' } ],
    ['aro', { origin: [8, 1], direction: 'vertical' } ],
    ['orma',    { origin: [0, 2], direction: 'horizontal' } ],
  ])
}

const GAMES = [
  GAME_DEV_1,
  GAME_DEV_2,
  GAME_DEV_3,
  GAME_DEV_4,
  GAME_DEV_5,
]

export default GAMES
