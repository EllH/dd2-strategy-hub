import DamageType from "@/enums/DamageType";
import ModType from "@/enums/ModType";
import HasOutputModifier from "@/traits/HasOutputModifier";

import type { ModInterface } from "@/interaces";
import type OutputModifier from "@/classes/OutputModifier";

export interface DefenseModDataResponse {
    id: string;
    name: string;
    description: string;
    inTooltip: boolean;
    type?: string;
    defensePowerModifier?: string;
    defenseHealthModifier?: string;
    defenseRateModifier?: string;
    defenseRangeModifier?: string;
    criticalChanceModifier?: string;
    criticalDamageModifier?: string;
    elementalAttunement?: string;
    compatibilities?: string;
}

export default class DefenseModData extends HasOutputModifier implements ModInterface {
    id: string = '';
    name: string = '';
    description: string = '';
    inTooltip: boolean = true;
    defensePower?: OutputModifier;
    defenseHealth?: OutputModifier;
    defenseRate?: OutputModifier;
    defenseRange?: OutputModifier;
    criticalChance?: OutputModifier;
    criticalDamage?: OutputModifier;
    elementalAttunement?: DamageType;
    compatibilities?: string[] = undefined;
    type?: ModType;

    constructor(data: DefenseModDataResponse) {
        super()

        this.populate(data)
    }

    /**
     * @param data
     * @protected
     */
    protected populate(data: DefenseModDataResponse): void {
        // Very basic check to see if data is present
        if (data.id === '' || data.name === '') {
            return
        }

        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.inTooltip = data.inTooltip
        this.type = ModType.createEnum(data.type)
        this.defensePower = this.getOutputModifierForValue(data.defensePowerModifier)
        this.defenseHealth = this.getOutputModifierForValue(data.defenseHealthModifier)
        this.defenseRate = this.getOutputModifierForValue(data.defenseRateModifier)
        this.defenseRange = this.getOutputModifierForValue(data.defenseRangeModifier)
        this.criticalChance = this.getOutputModifierForValue(data.criticalChanceModifier)
        this.criticalDamage = this.getOutputModifierForValue(data.criticalDamageModifier)
        this.elementalAttunement = DamageType.createEnum(data.elementalAttunement)

        if (data.compatibilities !== undefined) {
            this.compatibilities = data.compatibilities.split(',')
        }
    }
}
