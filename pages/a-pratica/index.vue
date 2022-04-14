<template>
  <div id="the-pratice" class="cordaria">
    <div class="exercise-nav container-fluid">
      <div class="row text-center layer-top align-items-center">
        <div class="col-12 col-lg-4">
          <b-sidebar
            id="sidebar-menu"
            title="Menu"
            class="menu-button"
            shadow
            bg-variant="dark"
            text-variant=""
            :visible="isEnabledMenu"
          >
            <div
              class="exercises-nav-layer d-flex flex-column align-items-center"
            >
              <ExerciseNav
                :lessons="lessons"
                :set="setNav"
                :is-visible-button-play="isVisibleButtonPlay"
                :is-visible-button-stop="isVisibleStopButton"
                :stop="stop"
                :score="score"
                @props="load"
              />
            </div>
          </b-sidebar>
          <b-button id="menu-button" v-b-toggle.sidebar-menu variant="dark"
            >Menu</b-button
          >
        </div>
        <div class="col-12 col-lg-4">
          <h1 class="title mt-3 mb-4">{{ title }}</h1>
        </div>
        <div class="col-12 col-lg-4 d-flex justify-content-center">
          <ScoreTerminal :score="score" />
          <button
            v-if="isVisibleStopButton"
            type="button"
            class="
              btn btn-danger btn-controls
              d-flex
              align-items-center
              justify-content-center
            "
            @click="stop(true)"
          >
            <font-awesome-icon class="fa fa-code stop" :icon="iconStop" />
          </button>
        </div>
      </div>
    </div>
    <div class="row justify-content-center bg-exercise-screen">
      <div class="col-lg-10 layer-center">
        <div class="exercise-screen">
          <ExerciseScreen
            :card="card"
            :suffled-deck="suffledDeck"
            :is-mobile="settings.isMobile"
          />
        </div>
      </div>
    </div>
    <div class="tips">
      <CatJump :tips="tips" />
    </div>
  </div>
</template>

<script>
// stop button
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStop } from '@fortawesome/free-solid-svg-icons'

// modules and functions
import Func from '@/plugins/functions'
import Animate from '@/plugins/animate'

// components
import CatJump from '@/components/cordaria/Tips'
import ExerciseNav from '@/components/cordaria/ExerciseNav'
import ExerciseScreen from '@/components/cordaria/ExerciseScreen'
import ScoreTerminal from '@/components/cordaria/Score'

library.add([faStop])

export default {
  name: 'APratica',
  components: {
    FontAwesomeIcon,
    CatJump,
    ExerciseNav,
    ExerciseScreen,
    ScoreTerminal,
  },
  async asyncData({ $http }) {
    const lessons = await $http.$get('./json/lessons.json')
    const scalesDeck = await $http.$get('./json/scales-deck.json')
    const arpeggiosDeck = await $http.$get('./json/arpeggios-deck.json')
    const acousticGuitar = await $http.$get('./json/acoustic-guitar.json')
    const eletricGuitar = await $http.$get('./json/eletric-guitar.json')
    const cavaco = await $http.$get('./json/cavaco.json')
    const bass = await $http.$get('./json/bass.json')
    const settingsNav = await $http.$get('./json/instrument-settings.json')
    const soundsCounter = await $http.$get('./json/sounds-counter.json')

    const tips = await $http.$get('./json/tips.json')

    return {
      // predefined lessons
      lessons: lessons.lessons,

      setNav: settingsNav.settings,

      //  decks
      scalesDeck: scalesDeck.scalesDeck,
      arpeggiosDeck: arpeggiosDeck.arpeggiosDeck,
      deck: null,

      // filtered deck
      suffledDeck: null,

      // sounds-counter settings
      soundsCounter: soundsCounter.soundsCounter,

      // instruments maps
      instruments: {
        acousticGuitar: acousticGuitar.guitarMap,
        eletricGuitar: eletricGuitar.guitarMap,
        cavaco: cavaco.cavacoMap,
        bass: bass.bassMap,
      },
      instrumentMap: null,

      // tips popup
      tips: tips.tips,

      // exercises settings
      settings: {
        isMobile: true,
        lesson: 1,
        firstFinger: 0,
        stringNumber: '1',
        bpm: 40,
        allStrings: false,
        direction: 'down',
        release: 1,
      },
      instrument: null,

      // Audios sequence
      sequence: null,

      // Cards and yours pointers
      card: {
        prev: {},
        current: {},
        next: {},
      },

      // Indexes
      i: {
        preCount: 4,
        cardValue: 0,
      },
      lengthSuffledDeck: 0,
      iCard: 0,
      // iValue: 0,

      swapCard: false,

      // Show Buttons
      isVisibleButtonPlay: false,
      isVisibleStopButton: false,
      iconStop: 'stop',

      // Playing
      tempo: null,

      // score painel
      score: 'Aguardando<br />para iniciar',

      fadeOutValue: 10,

      // Menu
      isEnabledMenu: true,
    }
  },
  data() {
    return {
      title: 'A PRÁTICA',
    }
  },
  head() {
    return {
      title: 'Cordaria - Pratique agora!',
      meta: [
        {
          hid: 'titlepratica',
          name: 'title',
          content: 'Já Praticou Hoje? Inicie agora mesmo seu treinamento!',
        },
        {
          hid: 'pratica',
          name: 'description',
          content: 'Inicie agora mesmo seu treinamento musical. Bons Estudos!',
        },
        {
          hid: 'particakeys',
          name: 'keywords',
          content: 'Treinamento, Método, Violão, Guitarra, Dedilhado',
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://cordaria.com.br/a-pratica',
        },
      ],
    }
  },

  watch: {
    i(newI) {
      return newI
    },

    score(newScore) {
      return newScore
    },

    suffledDeck(newSuffledDeck) {
      return newSuffledDeck
    },

    card(newCard) {
      return newCard
    },

    tempo(newTempo) {
      return newTempo
    },
  },

  created() {
    this.sendPropsHideFooter()
  },

  mounted() {
    this.isVisibleButtonPlay = true
  },
  destroyed() {
    this.stop(true)
  },
  methods: {
    load(payload) {
      // hide Menu
      this.isEnabledMenu = payload.isEnabledMenu

      this.isVisibleButtonPlay = false
      this.score = 'Carregando<br>...'

      // getting selected instrument
      this.instrument = payload.instrument
      this.instrumentMap = Func.selectInstrument(
        this.instrument,
        this.instruments
      )
      // getting form data
      this.settings = Func.getData(payload, this.settings, this.lessons)

      // getting audios
      this.sampler = Func.getAudios(
        this.instrumentMap,
        this.settings,
        this.soundsCounter
      )

      this.startTraining()
    },

    // Main Method
    startTraining() {
      // selecting deck
      if (this.settings.stringNumber === 'arpeggio') {
        this.deck = this.arpeggiosDeck
      } else {
        this.deck = this.scalesDeck
      }

      // suffling Deck
      this.suffledDeck = Func.generateExercise(
        this.deck,
        this.settings.firstFinger
      )

      // generating audios sequence
      this.tempo = Func.convertBpmToMs(this.settings.bpm)
      this.settings.release = Func.calculateRelease(this.tempo)
      this.sequence = Func.generateSequence(
        this.settings,
        this.suffledDeck,
        this.instrumentMap,
        this.sampler
      )

      // preparing lesson screen
      this.card.current = this.suffledDeck[0]
      this.card.next = this.suffledDeck[1]

      this.lengthSuffledDeck = this.suffledDeck.length
      this.i.preCount = this.card.current.fragments.length

      // starting practice
      this.timer = setInterval(this.practice, this.tempo)
      this.isVisibleStopButton = false
    },

    practice() {
      const lengthCardValue = this.card.current.value.length - 1

      // starting audio sequence
      this.sendSequence()
      this.sequence.start()

      // eneabling stop button
      this.isVisibleStopButton = true

      // starting preCount
      if (this.i.preCount > 0) {
        this.score = `Iniciando em <br /><b>${this.i.preCount}!</b>`

        this.i.preCount = this.i.preCount - 1

        // starting practice execution
      } else if (this.iCard <= this.lengthSuffledDeck) {
        this.score = `<b>Executando<br /></b>...`

        if (this.swapCard) {
          // animate cards
          this.iCard = Animate.startAnimateCards(
            this.iCard,
            this.card,
            this.suffledDeck,
            this.lengthSuffledDeck
          )

          this.i.cardValue = 0
        }

        // animate values of cards

        this.i.cardValue = Animate.startAnimateValues(
          this.i.cardValue,
          this.iCard,
          this.lengthSuffledDeck,
          this.card,
          this.suffledDeck,
          this.score,
          this.finish
        )

        // testing when to switch cards
        if (this.i.cardValue > lengthCardValue) {
          this.swapCard = true
        } else {
          this.swapCard = false
        }
      }
    },

    sendSequence() {
      this.$emit('sequence', this.sequence)
    },

    finish() {
      clearInterval(this.timer)
      this.score = 'Parabéns!<br />Treinamento concluído.'
    },

    stop(isResetRouter) {
      if (this.sequence != null) {
        clearInterval(this.timer)
        this.sequence.stop()
        this.isVisibleStopButton = false
        this.score = 'Aguardando<br />...'
        this.card.prev = {}
        this.card.current = {}
        this.card.next = {}
        this.suffledDeck.length = 0
        this.isVisibleButtonPlay = true
      }
      if (isResetRouter) {
        this.$router.go()
      }
    },
    sendPropsHideFooter() {
      this.$emit('props', {
        hideFooter: true,
      })
    },
  },
}
</script>

<style>
b-button {
  width: 45px;
  height: 45px;
}

.bg-exercise-screen {
  background-color: var(--bg-nav);
}

#sidebar-menu {
  background-color: rgba(0, 0, 0, 0.7) !important;
  font-family: 'Encode Sans';
  font-weight: var(--font-semi-bold);
}

#menu-button {
  color: var(--font-color-p);
}
#menu-button:hover {
  color: rgba(255, 255, 255, 0.7);
}

.exercise-nav {
  background-color: rgba(255, 255, 255, 0.1);
}

.exercise-screen {
  justify-content: center;
}

.sidebar-menu-enabled {
  display: flex !important;
}

.sidebarMenuDisabled {
  display: none !important;
}

.b-sidebar-body {
  display: flex !important;
  align-items: center !important;
}
.close {
  color: white;
}
.close:hover {
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
