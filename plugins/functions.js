/* eslint-disable no-console */
// Functions.js
// This module contains the functions and methods used to run the application.

// Math Functions
import * as Tone from 'tone' // to play the audios

export default {
  // converting beats per minute for miliseconds
  convertBpmToMs(bpm) {
    const newTempo = 60000 / bpm
    return newTempo
  },

  // adjusting release (audio)
  calculateRelease(tempo) {
    const adjustSync = 1.1 // <-- ajust here the release duration for legattos notes
    const release = (tempo / 1000) * adjustSync
    return release
  },

  // auxiliary function to suffle cards
  sortIndex(max) {
    const min = Math.ceil(0)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  // end Math functions

  // selecting instrument
  selectInstrument(instrument, instruments) {
    let instrumentMap = {}
    switch (instrument) {
      case 'acoustic-guitar':
        instrumentMap = instruments.acousticGuitar
        break
      case 'eletric-guitar':
        instrumentMap = instruments.eletricGuitar
        break
      case 'cavaco':
        instrumentMap = instruments.cavaco
        break
      case 'bass':
        instrumentMap = instruments.bass
        break
      default:
        break
    }
    return instrumentMap
  },

  //
  getMetronomeUrls(soundsCounter, urls) {
    urls[soundsCounter.high.note] = `${soundsCounter.high.url}.mp3`
    urls[soundsCounter.low.note] = `${soundsCounter.low.url}.mp3`
    return urls
  },

  getLooseStringsUrls(instrumentMap, urls) {
    for (const i in instrumentMap) {
      const fret = instrumentMap[i]
      if (i > 0) {
        urls[fret[0].note] = `${fret[0].tablature}.mp3`
      }
    }
    return urls
  },

  getAllStringsUrls(instrumentMap, urls) {
    for (const i in instrumentMap) {
      const fret = instrumentMap[i]
      if (i > 0) {
        fret.forEach((element) => {
          urls[element.note] = `${element.tablature}.mp3`
        })
      }
    }
    return urls
  },
  // getting audios

  getAudios(instrumentMap, settings, soundsCounter) {
    // starting Audio library

    if (Tone.context.state !== 'running') {
      Tone.context.resume()
    }

    let urls = {}
    // get audios for the metronome
    urls = this.getMetronomeUrls(soundsCounter, urls)

    // get audios for the arpeggio mode.
    if (settings.stringNumber === 'arpeggio') {
      urls = this.getLooseStringsUrls(instrumentMap, urls)
      // get audios for normal mode.
    } else {
      urls = this.getAllStringsUrls(instrumentMap, urls)
    }

    const instrumentUrl = instrumentMap[0][0].baseUrl
    const sampler = new Tone.Sampler({
      urls,
      baseUrl: instrumentUrl,
      onload: () => {
        this.isLoaded = true
      },
    }).toDestination()

    return sampler
  },

  // getting Data
  getData(payload, settings, lessons) {
    payload.view === 'mobile'
      ? (settings.isMobile = true)
      : (settings.isMobile = false)

    settings.lesson = payload.lesson

    if (payload.lesson !== 0) {
      const lesson = payload.lesson.toString()
      settings.firstFinger = lessons[lesson].firstFinger
      settings.stringNumber = lessons[lesson].stringNumber
      settings.bpm = lessons[lesson].bpm
    } else {
      settings.mode = payload.mode
      settings.firstFinger = payload.firstFinger
      settings.stringNumber = payload.stringNumber
      settings.bpm = payload.bpm
    }
    return settings
  },

  // setting case if all strings is selected.
  configAllStrings(settings, numberOfStrings) {
    switch (settings.mode) {
      case 'fromBassToTreble':
        settings.stringNumber = numberOfStrings
        settings.direction = 'down'
        break
      case 'fromTrebleToBass':
        settings.stringNumber = 1
        settings.direction = 'up'
        break
      default:
    }
    return settings
  },
  // changing string
  changingString(settings, numberOfStrings) {
    if (settings.direction === 'down') {
      settings.stringNumber--
    } else {
      settings.stringNumber++
    }

    if (
      (settings.stringNumber === 1 && numberOfStrings === 4) ||
      (settings.stringNumber === 1 && numberOfStrings === 6)
    ) {
      settings.direction = 'up'
    }
    if (
      (settings.stringNumber === 4 && numberOfStrings === 4) ||
      (settings.stringNumber === 6 && numberOfStrings === 6)
    ) {
      settings.direction = 'down'
    }

    return settings
  },

  convertArpeggiosFragment(fragment) {
    switch (fragment) {
      case 'P':
        fragment = 4
        break
      case 'I':
        fragment = 3
        break
      case 'M':
        fragment = 2
        break
      case 'A':
        fragment = 1
        break
      default:
        break
    }
    return fragment
  },

  concatenateNotes(metronomeNotes, exerciseNotes) {
    const notes = []
    metronomeNotes.forEach((element) => {
      notes.push(element)
    })
    exerciseNotes.forEach((element) => {
      notes.push(element)
    })
    return notes
  },

  // preparing and getting notes
  prepareToGetNotes(deck, instrumentMap, settings, numberOfStrings) {
    const notes = []
    deck.forEach((card) => {
      card.fragments.forEach((fragments) => {
        const fragment = fragments.fragment
        notes.push(this.getNotes(fragment, instrumentMap, settings))
      })
      if (settings.allStrings) {
        settings = this.changingString(settings, numberOfStrings)
      }
    })
    return notes
  },

  // generatting sequence
  generateSequence(settings, deck, instrumentMap, sampler) {
    const numberOfStrings = instrumentMap[0][0].numberOfStrings

    let notes = null
    let exerciseNotes = null
    // starting metronome sequence

    // config if all strings enable
    switch (settings.mode) {
      case 'fromBassToTreble':
      case 'fromTrebleToBass':
        settings.allStrings = true
        settings = this.configAllStrings(settings, numberOfStrings)
        exerciseNotes = this.prepareToGetNotes(
          deck,
          instrumentMap,
          settings,
          numberOfStrings
        )

        break
      case 'arpeggio':
        exerciseNotes = this.prepareToGetNotes(
          deck,
          instrumentMap,
          settings,
          numberOfStrings
        )

        break
      case 'normal':
        exerciseNotes = this.prepareToGetNotes(
          deck,
          instrumentMap,
          settings,
          numberOfStrings
        )
    }

    // concatenating metronome and exercises notes
    const metronomeNotes = ['C1', 'C0', 'C0', 'C0', 'C0']
    notes = this.concatenateNotes(metronomeNotes, exerciseNotes)

    const seq = new Tone.Sequence(
      (time, note) => {
        sampler.triggerAttackRelease(note, settings.release, time)
      },
      notes,
      '4n'
    )
    seq.loop = false
    Tone.Transport.bpm.value = settings.bpm
    Tone.Transport.start()
    return seq
  },

  getNotes(fragment, instrumentMap, settings) {
    let note = null

    if (settings.mode === 'arpeggio') {
      const stringNumber = this.convertArpeggiosFragment(fragment)
      const fret = 0
      // const strings = instrumentMap[settings.stringNumber]
      note = `${stringNumber}${fret}`
    } else {
      const fret = fragment
      const strings = instrumentMap[settings.stringNumber]
      const tablature = settings.stringNumber + fret
      note = strings[fret][tablature]
    }
    console.warn('note:', note)

    return note
  },

  // selecting  first finger
  filterFinger(firstFinger) {
    return function filter(finger) {
      // convert number values of string values
      const value = finger.value[0].toString()
      const filter = firstFinger.toString()
      return value === filter
    }
  },

  filterLooseStrings(instrumentMap) {
    const shadowInstumentMap = []
    instrumentMap[0].forEach((element, i) => {
      if (i > 0) {
        shadowInstumentMap.push = element[0]
      }
    })
    return shadowInstumentMap
  },

  // generating visual cards
  generateExercise(deck, firstFinger, isToFilter) {
    let shadowDeck = deck.slice()
    // eslint-disable-next-line no-console
    console.log('shadowDeck:', shadowDeck)
    for (let i = shadowDeck.length; i > 0; i--) {
      const sortedIndex = this.sortIndex(i)
      const card = shadowDeck[sortedIndex]
      shadowDeck.push(card)
      shadowDeck.splice(sortedIndex, 1)
    }

    if (isToFilter) {
      shadowDeck = shadowDeck.filter(this.filterFinger(firstFinger))
    }
    return shadowDeck
  },
}
