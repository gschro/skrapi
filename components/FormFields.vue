<template>
  <form
    @submit.prevent="submitForm"
    method="post"
    novalidate="true"
    class="columns is-mobile is-multiline">
    <b-field v-for="(field, key) of fields" :key="key" :label="field.label" :type="field.type" :message="field.message" :custom-class="requiredField(field.required)" class='column mb-3 is-one-third-widescreen is-12-mobile small-gap no-marginb'>
      <component
        :is="field.component"
        :type="field.type"
        v-model="modelObj[field.field]"
        :aria-required="field.required"
        :required="field.required"
        :disabled="field.disabled"
        :hour-format="field.hourFormat"
        :date-formatter="field.dateFormatter"
        :editor="field.editor"
        :options="field.jsonOptions"
      >
        <template v-if="field.component === 'b-select' && field.options" >
          <option v-for="(option, key) of field.options" :key="key">{{option}}</option>
        </template>
        <template v-if="field.component === 'b-select' && field.remote">
          <option v-for="(option, key) of remotes[field.field]" :key="key" :value="option.id">{{option[field.mainField]}}</option>
        </template>
      </component>
    </b-field>
    <slot></slot>
    <div class="column is-12">
      <b-button tag="input"
        type="is-primary"
        native-type="submit"
        :value="buttonLabel" />
    </div>
  </form>
</template>


<style>
.control .select, .control .select select {
  width: 100%;
}
.no-marginb {
  margin-bottom: 0;
}
div.field:not(:last-child) {
  margin-bottom: 0 !important;
}
.required:after {
    content:"*";
    color: red;
  }
</style>

<script>
import FetchPending from '~/components/FetchPending'

export default {
  name: 'FormFields',
  components: {
    FetchPending
  },
  props: {
    name: {
      type: String
    },
    fields: {
      type: Array,
      required: true
    },
    model: {
      type: Object,
      required: true
    },
    remotes: {
      type: Object
    },
    plural: {
      type: String
    },
    redirect: {
      type: String
    },
    method: {
      type: String
    },
    modelName: {
      type: String
    }
  },
  data () {
    return {
      modelObj: this.model,
      errors: []
    }
  },
  computed: {
    finalMethod () {
      return this.method === 'put' ? 'Update' : 'Add'
    },
    buttonLabel () {
      return `${this.finalMethod} ${this.name}`
    },
    messageLabel () {
      const ending = this.finalMethod.endsWith('e') ? 'd' : 'ed'
      return `${this.name} ${this.finalMethod}${ending}!`
    },
    axiosMethod () {
      return `$${this.method}`
    },
    finalRoute () {
      const id = this.method === 'put' ? `/${this.modelObj.id}` : ''
      const route = this.modelName || this.plural.toLowerCase()
      return `/${route}${id}`
    }
  },
  methods: {
    requiredField: (required) => {
      return required ? 'required' : ''
    },
    requiredFields: function () {
      this.errors = []
      this.fields.filter(a => a.required).map(a => {
        const field = a.field
        const index = this.fields.findIndex(a => a.field === field)
        if (!this.modelObj[field]) {
          this.fields[index].componentState = 'is-danger'
          const error = `${a.label} is required`
          this.fields[index].message = error
          this.errors.push(error)
        } else {
          this.fields[index].componentState = ''
          this.fields[index].message = ''
        }
      })
    },
    setTime(field) {
      console.log("field!", field)
      const d = this.modelObj[field.field]
      console.log('d!', d)
      const time = d.toISOString().split('T').shift();
      // const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
      console.log('TIME!', time)
      this.modelObj[field.field] = time
    },
    parseTimeFields() {
      console.log('here!')
      const timeFields = this.fields.filter(a => a.type === 'time').forEach(a => {
        console.log('here2!')
        // this.setTime(a)
      const d = this.modelObj[a.field]
      console.log('d!', d)
      const time = d.toISOString().split('T').shift();
      const ft = a => String(a).padStart(2, '0')
      const time2 = `${ft(d.getHours())}:${ft(d.getMinutes())}:${ft(d.getSeconds())}`
      console.log('TIME!', time2)
      this.modelObj[a.field] = time2
      })
    },
    submitForm: async function (e) {
      this.parseTimeFields()
      this.requiredFields()
      if (this.errors.length > 0) {
        return
      }

      await this.$axios[this.axiosMethod](this.finalRoute, this.modelObj)
      const join = this.redirect.includes('?') ? '&' : '?'
      this.$router.push(`${this.redirect}${join}message=${this.messageLabel}`)
    }
  },
}
</script>
