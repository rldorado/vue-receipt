<template>
        <section>
            <div>
                <md-field>
                    <md-icon>label_important</md-icon>
                    <label>{{ $t('receipt.number') }}</label>
                    <md-input v-model="receipt.num" />
                </md-field>
                <md-field>
                    <md-icon>place</md-icon>
                    <label>{{ $t('receipt.location') }}</label>
                    <md-input v-model="receipt.loc" />
                </md-field>
                <md-field>
                    <md-icon>euro_symbol</md-icon>
                    <label>{{ $t('receipt.total') }}</label>
                    <md-input :value="conceptTotal + '€'" disabled />
                </md-field>
            </div>
            <div>
                <md-datepicker v-model="receipt.date">
                    <label>{{ $t('receipt.emission') }}</label>
                </md-datepicker>
                <md-field>
                    <md-icon>event</md-icon>
                    <label>{{ $t('receipt.expiration') }}</label>
                    <md-input v-model="receipt.expiration" />
                </md-field>
            </div>
            <div>
                <md-list>
                    <md-subheader>{{ $t('receipt.concepts') }}</md-subheader>
                    <md-list-item v-for="(concept, index) in receipt.concepts" :key="index">
                        <div class="md-list-item-text">
                            <md-input v-model="concept.name" />
                            <md-input pattern="-?[0-9]*(\.[0-9]+)?" v-model="concept.amount"> €</md-input>
                        </div>
                        <md-button class="md-fab md-mini md-icon-button md-list-action" @click="deleteConcept(index)">
                            <md-icon>remove</md-icon>
                        </md-button>
                    </md-list-item>
                </md-list>
                <md-button class="md-raised" @click="addConcept">
                    {{ $t('receipt.add') }} <md-icon>add</md-icon>
                </md-button>
            </div>
            <md-field>
                <md-icon>home</md-icon>
                <label>{{ $t('receipt.address') }}</label>
                <md-input v-model="receipt.home" />
            </md-field>
            <div>
                <md-field>
                    <label>{{ $t('receipt.payer') }}</label>
                    <md-textarea rows="5" cols="50" v-model="receipt.payer" />
                </md-field>
                <md-field>
                    <label>{{ $t('receipt.collector') }}</label>
                    <md-textarea rows="5" cols="50" v-model="receipt.collector" />
                </md-field>
            </div>
            <md-field>
                <md-icon>drive_file_rename_outline</md-icon>
                <label>{{ $t('receipt.filename') }}</label>
                <md-input id="filename" :value="filename"
                    v-on:input="$emit('filename', $event.target.value)" />
            </md-field>
        </section>
</template>

<script>
export default {
    props: ['receipt', 'filename'],
    computed: {
        conceptTotal() { 
            return this.receipt.concepts.reduce((total,item) => total + Number(item.amount, 2), 0);
        }
    },
    methods: {
        addConcept() { this.receipt.concepts.push({ name: '', amount: 0 }); },
        deleteConcept(index) { this.receipt.concepts.splice(index, 1); }
    }
}
</script>
