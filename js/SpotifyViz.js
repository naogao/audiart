import Visualizer from './classes/visualizer'

export default class SpotifyViz extends Visualizer {
  constructor () {
    super()
  }

  hooks () {
    this.sync.on('tatum', tatum => {
      // do something on every tatum
    })

    this.sync.on('segment', ({ index }) => {
      if (index % 2 === 0) {
        // do something on every second segment
      }
    })

    this.sync.on('beat', ({ duration }) => {
      // do something on every beat, using the beat's duration in milliseconds
    })

    this.sync.on('bar', bar => {
      // you get...
    })

    this.sync.on('section', section => {
      // ...the idea, friends
    })
  }

  paint ({ now, ctx, width, height }) {
    console.log(this.sync.volume)
    console.log(this.sync.beat)
  }
}  