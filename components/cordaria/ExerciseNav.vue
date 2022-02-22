/* eslint-disable vue/no-template-shadow */
<template>
  <form class="container-fluid form mt-3">
    <div class="row text-center justify-content-center">
      <div class="col-lg-2 col-md-4 col-6 d-flex justify-self-center">
        <div class="select-instrument form-group">
          <label for="select-instrument-mode" class="form-label"
            >Instrumento
          </label>
          <select
            id="select-instrument-mode"
            v-model="instrument"
            class="form-select justify-content-center"
          >
            <option value="guitar">Violão/Guitarra</option>
            <option disabled value="cavaco">Cavaquinho (em breve!)</option>
            <option disabled value="guitar2">Guitarra (em breve!)</option>
            <option disabled value="bass">Baixo (em breve!)</option>
          </select>
        </div>
      </div>

      <div class="col-lg-2 col-md-4 col-6 d-flex justify-self-center">
        <div class="select-screen form-group">
          <label for="select-screen-mode" class="form-label"
            >Visualização
          </label>
          <select
            id="select-screen-mode"
            v-model="view"
            class="form-select justify-content-center"
          >
            <option value="mobile">3 cartas</option>
            <option value="desktop">Todas as cartas</option>
          </select>
        </div>
      </div>

      <div class="col-lg-2 col-md-4 col-6 d-flex justify-self-center">
        <div class="select-lesson form-group">
          <label for="select-lesson" class="form-label">Lições</label>
          <br />

          <select id="select-lesson" v-model="lesson" class="form-select">
            <option
              v-for="currentLesson in lessons"
              :key="currentLesson.id"
              :value="currentLesson.id"
            >
              {{ currentLesson.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="col-lg-2 col-md-4 col-6 d-flex justify-self-center">
        <div class="select-first-finger form-group">
          <label for="select-first-finger" class="form-label"
            >Primeiro Dedo</label
          >
          <br />
          <select
            id="select-first-finger"
            v-model="firstFinger"
            class="form-select disabled"
            :disabled="isReadtoLoad"
          >
            <option value="0">Nenhum (Corda Solta)</option>
            <option value="1" class="selected">Dedo 1</option>
            <option value="2">Dedo 2</option>
            <option value="3">Dedo 3</option>
            <option value="4">Dedo 4</option>
            <!-- <option value="all">Todos</option> avaliable for future versions-->
            <!-- <option value="P">PMIA</option> avaliable for future versions-->
          </select>
        </div>
      </div>

      <div class="col-lg-2 col-md-4 col-6 d-flex justify-self-center">
        <div class="select-string form-group">
          <label for="select-string" class="form-label"> Corda</label>
          <br />
          <select
            id="select-string"
            v-model="stringNumber"
            class="form-select"
            :disabled="isReadtoLoad"
          >
            <template v-if="instrument === 'guitar'">
              <option value="1">Corda 1 (Mi4)</option>
              <option value="2">Corda 2 (Si3)</option>
              <option value="3">Corda 3 (Sol3)</option>
              <option value="4">Corda 4 (Ré3)</option>
              <option value="5">Corda 5 (Lá2)</option>
              <option value="6">Corda 6 (Mi2)</option>
              <option value="allUp">Todas (ascendente)</option>
              <option value="allDown">Todas (descendente)</option>
            </template>
            <template v-else-if="instrument === 'cavaco'">
              <option value="1">Corda 1 (Ré5)</option>
              <option value="2">Corda 2 (Si4)</option>
              <option value="3">Corda 3 (Sol4)</option>
              <option value="4">Corda 4 (Ré4)</option>
            </template>
            <template v-else-if="instrument === 'guitar2'">
              <option value="1">Corda 1 (Mi4)</option>
              <option value="2">Corda 2 (Si3)</option>
              <option value="3">Corda 3 (Sol3)</option>
              <option value="4">Corda 4 (Ré3)</option>
              <option value="5">Corda 5 (Lá2)</option>
              <option value="6">Corda 6 (Mi2)</option>
              <option value="allUp">Todas (ascendente)</option>
              <option value="allDown">Todas (descendente)</option>
            </template>
            <template v-else-if="instrument === 'bass'">
              <option value="1">Corda 1 (Sol2)</option>
              <option value="2">Corda 2 (Ré2)</option>
              <option value="3">Corda 3 (Lá1)</option>
              <option value="4">Corda 4 (Mi1)</option>
            </template>
          </select>
        </div>
      </div>
      <div class="col-lg-2 col-md-4 col-6 d-flex justify-self-center">
        <div class="select-andamento form-group">
          <label for="tempo" class="form-label">Andamento</label>
          <br />
          <input
            id="tempo-number"
            v-model="bpm"
            class="tempo form-number"
            type="number"
            min="30"
            max="200"
            aria-required="true"
            aria-invalid="false"
            :disabled="isReadtoLoad"
            step="2"
          />
          <br />
          <div class="slidecontainer">
            <input
              id="tempo-range"
              v-model="bpm"
              class="tempo form-range slider"
              type="range"
              min="30"
              max="200"
              :disabled="isReadtoLoad"
              step="2"
            />
          </div>
        </div>
      </div>

      <div class="col-lg-2 col-md-4 col-6 d-flex justify-self-center control">
        <div class="row form-group">
          <div class="col">
            <div class="row">
              <Score :score="score" />
            </div>
            <div class="row justify-content-center">
              <div class="buttons d-flex justify-content-center pt-1">
                <button
                  v-if="isVisibleButtonStop"
                  type="button"
                  class="btn btn-danger btn-controls d-flex align-items-center justify-content-center"
                  @click="stop(true)"
                >
                  <font-awesome-icon class="fa fa-code stop" :icon="iconStop" />
                </button>
                <button
                  v-if="isVisibleButtonPlay"
                  type="button"
                  class="btn btn-success btn-controls d-flex align-items-center justify-content-center"
                  @click="sendProps"
                >
                  <font-awesome-icon class="fa fa-code" :icon="iconPlay" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
    </div>
  </form>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Score from '@/components/cordaria/Score'

library.add([faPlay, faStop])

export default {
  components: { FontAwesomeIcon, Score },

  props: {
    isVisibleButtonPlay: Boolean,
    isVisibleButtonStop: Boolean,
    lessons: {
      type: Array,
      default() {
        return []
      },
    },
    stop: {
      type: Function,
      default() {
        return {}
      },
    },
    score: { type: String, default: '' },
  },

  // eslint-disable-next-line require-await
  data() {
    return {
      instrument: 'guitar',
      view: 'mobile',
      iconPlay: 'play',
      iconStop: 'stop',
      lesson: 1,
      firstFinger: 0,
      stringNumber: 1,
      bpm: 40,
      loadActiveThePratice: true,
      isReadtoLoad: true,
    }
  },

  watch: {
    lesson(newLesson) {
      this.firstFinger = this.lessons[newLesson].firstFinger
      this.stringNumber = this.lessons[newLesson].stringNumber
      this.bpm = this.lessons[newLesson].bpm

      newLesson === 0 ? (this.isReadtoLoad = false) : (this.isReadtoLoad = true)

      return newLesson
    },

    firstFinger(newFirstFinger) {
      return newFirstFinger
    },

    stringNumber(newStringNumber) {
      return newStringNumber
    },

    bpm(newBpm) {
      return newBpm
    },
  },

  methods: {
    sendProps() {
      this.$emit('props', {
        lesson: this.lesson,
        firstFinger: this.firstFinger,
        stringNumber: this.stringNumber,
        bpm: this.bpm,
        view: this.view,
        loadActiveThePratice: this.loadActiveThePratice,
        instrument: this.instrument,
      })
    },
  },
}
</script>

<style>
form.form {
  width: 80%;
}

select:disabled,
input:disabled {
  background-color: rgba(0, 0, 0, 0.1) !important;
  color: rgba(255, 255, 255, 0.5) !important;
}

label {
  font-family: 'Encode Sans';
  font-weight: var(--font-regular);
  font-size: 0.9em;
}
select.form-select,
input.form-number {
  font-family: 'Encode Sans';
  font-weight: var(--font-semi-bold);

  background-color: #1a1b24;
  color: aliceblue;
  width: 120px;
  border: none;
  font-size: 0.8em;
}

.btn-controls {
  /* position: absolute; */
  width: 30px;
  height: 30px;
}
.fa {
  font-size: 0.6em;
}

/* slider style */

input.slider {
  /*removes default webkit styles*/
  -webkit-appearance: none;

  /*fix for FF unable to apply focus style bug */
  /* border: 1px solid white; */

  /*required for proper track sizing in FF*/
  width: 120px;
}
input.slider::-webkit-slider-runnable-track {
  width: 120px;
  height: 5px;
  background: #1a1b24;
  border: none;
  border-radius: 3px;
}
input.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #7d7d7d;
  margin-top: -4px;
}
input.slider:focus {
  outline: none;
}
input.slider:focus::-webkit-slider-runnable-track {
  background: #ccc;
}

input.slider::-moz-range-track {
  width: 120px;
  height: 5px;
  background: #ddd;
  border: none;
  border-radius: 3px;
}
input.slider::-moz-range-thumb {
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #7d7d7d;
}

/*hide the outline behind the border*/
input.slider:-moz-focusring {
  outline: 1px solid white;
  outline-offset: -1px;
}

input.slider::-ms-track {
  width: 120px;
  height: 5px;

  /*remove bg colour from the track, we'll use ms-fill-lower and ms-fill-upper instead */
  background: transparent;

  /*leave room for the larger thumb to overflow with a transparent border */
  border-color: transparent;
  border-width: 6px 0;

  /*remove default tick marks*/
  color: transparent;
}
input.slider::-ms-fill-lower {
  background: #777;
  border-radius: 10px;
}
input.slider::-ms-fill-upper {
  background: #ddd;
  border-radius: 10px;
}
input.slider::-ms-thumb {
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #7d7d7d;
}
input.slider:focus::-ms-fill-lower {
  background: #888;
}
input.slider:focus::-ms-fill-upper {
  background: #ccc;
}

@media (max-width: 575.98px) {
  label {
    margin-top: 20px !important;
    margin-bottom: 10px !important;
  }
  .control {
    margin-top: 30px !important;
  }
}

@media (min-width: 576px) and (max-width: 991.98px) {
  label {
    margin-top: 10px !important;
    margin-bottom: 10px !important;
  }
  .control {
    margin-top: 10px !important;
  }
}
</style>
