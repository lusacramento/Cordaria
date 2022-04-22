/* eslint-disable vue/no-template-shadow */
<template>
  <form class="container-fluid form-row justify-content-center">
    <div
      class="
        form-group
        col-6 col-lg-12
        justify-self-center justify-content-center
        select-instrument
      "
    >
      <label for="select-instrument-mode" class="form-label"
        >Instrumento
      </label>
      <br />
      <select
        id="select-instrument-mode"
        v-model="instrument"
        class="controls justify-self-center"
      >
        <option :value="set.guitars.acoustic.name">
          {{ set.guitars.acoustic.label }}
        </option>
        <option :value="set.cavaco.name">{{ set.cavaco.label }}</option>
        <option :value="set.guitars.electric.name">
          {{ set.guitars.electric.label }}
        </option>
        <option :value="set.bass.name">{{ set.bass.label }}</option>
      </select>
    </div>

    <div class="form-group col-6 col-lg-12 col-6 col-lg-12 select-screen">
      <label for="select-screen-mode" class="form-label">Visualização </label>
      <br />
      <select id="select-screen-mode" v-model="view" class="controls">
        <option value="mobile">3 cartas</option>
        <option value="desktop">Todas as cartas</option>
      </select>
    </div>
    <div class="form-group col-6 col-lg-12 select-lesson">
      <label for="select-lesson" class="form-label">Lições</label><br />
      <select id="select-lesson" v-model="lesson" class="controls">
        <option
          v-for="currentLesson in lessons"
          :key="currentLesson.id"
          :value="currentLesson.id"
        >
          {{ currentLesson.name }}
        </option>
      </select>
    </div>

    <div class="form-group col-6 col-lg-12 select-mode">
      <label for="select-mode" class="form-label">Modo</label>
      <br />
      <select
        id="select-mode"
        v-model="mode"
        class="controls disabled"
        :disabled="isReadtoLoad"
      >
        <option v-for="md in set.modes" :key="md.mode" :value="md.mode">
          {{ md.label }}
        </option>
      </select>
    </div>

    <div class="form-group col-6 col-lg-12 select-first-finger">
      <label for="select-first-finger" class="form-label">Primeiro Dedo</label>
      <br />
      <select
        id="select-first-finger"
        v-model="firstFinger"
        class="controls disabled"
        :disabled="isReadtoLoad"
      >
        <option
          v-for="fF in set.firstFingers"
          :key="fF.firstFinger"
          :value="fF.firstFinger"
        >
          {{ fF.firstFinger }}
        </option>
      </select>
    </div>

    <div class="form-group col-6 col-lg-12 select-string">
      <label for="select-string" class="form-label"> Corda</label>
      <br />
      <select
        id="select-string"
        v-model="stringNumber"
        class="controls"
        :disabled="isReadtoLoad"
      >
        <template
          v-if="
            instrument === 'acoustic-guitar' || instrument === 'eletric-guitar'
          "
        >
          <option
            v-for="st in set.guitars.strings"
            :key="st.string"
            :value="st.string"
          >
            {{ st.label }}
          </option>
        </template>
        <template v-else-if="instrument === 'cavaco'">
          <option
            v-for="st in set.cavaco.strings"
            :key="st.string"
            :value="st.string"
          >
            {{ st.label }}
          </option>
        </template>
        <template v-else-if="instrument === 'bass'">
          <option
            v-for="st in set.bass.strings"
            :key="st.string"
            :value="st.string"
          >
            {{ st.label }}
          </option>
        </template>
      </select>
    </div>
    <div class="form-group col-6 col-lg-12">
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
    <div class="col-12">
      <div class="buttons pt-1 d-flex justify-content-center">
        <button
          v-if="isVisibleButtonPlay"
          type="button"
          class="
            btn btn-success btn-controls
            d-flex
            align-items-center
            justify-content-center
          "
          @click="sendProps"
        >
          <font-awesome-icon class="fa fa-code" :icon="iconPlay" />
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add([faPlay])

export default {
  name: 'ExerciseNav',

  components: { FontAwesomeIcon },

  props: {
    isVisibleButtonPlay: Boolean,
    isVisibleButtonStop: Boolean,
    lessons: {
      type: Array,
      default() {
        return []
      },
    },
    set: {
      type: Object,
      default() {
        return {}
      },
    },
    stop: {
      type: Function,
      default() {
        return {}
      },
    },
  },

  // eslint-disable-next-line require-await
  data() {
    return {
      instrument: 'acoustic-guitar',
      view: 'mobile',
      iconPlay: 'play',
      lesson: 1,
      mode: 'normal',
      firstFinger: 0,
      stringNumber: 1,
      bpm: 40,
      loadActiveThePratice: true,
      isReadtoLoad: true,
      isEnabledMenu: false,

      data: {
        guitars: {
          acoustic: { name: 'acoutic guitar' },
          eletric: { name: 'eletric guitar' },
        },
      },
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
        mode: this.mode,
        firstFinger: this.firstFinger,
        stringNumber: this.stringNumber,
        bpm: this.bpm,
        view: this.view,
        loadActiveThePratice: this.loadActiveThePratice,
        instrument: this.instrument,
        isEnabledMenu: this.isEnabledMenu,
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

select.controls,
input.form-number {
  font-family: 'Encode Sans';
  font-weight: var(--font-semi-bold);
  background-color: #1a1b24;
  color: aliceblue;
  width: 120px;
  height: 30px;
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

/* @media (max-width: 575.98px) {
  label {
    margin-top: 20px !important;
    margin-bottom: 10px !important;
  }
  .control {
    margin-top: 30px !important;
  }
} */

/* @media (min-width: 576px) and (max-width: 991.98px) {
  label {
    margin-top: 10px !important;
    margin-bottom: 10px !important;
  }
  .control {
    margin-top: 10px !important;
  }
} */
</style>
