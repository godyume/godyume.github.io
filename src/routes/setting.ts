import { Env } from "~/logic/Tuning"

export enum Elements {
    originTable = 'originTable',
    toTable = 'toTable',

    selectDays = 'selectDays',
    selectCourses = 'selectCourses',
    selectIsOrder = 'selectIsOrder',
    selectSteps = 'selectSteps',
    selectTeacher = 'selectTeacher',
    selectSol = 'selectSol'
}

export function clean(element: Elements) {
    const ele = document.getElementById(element)
    if (ele) {
        ele.innerHTML = ''
    }
}

export class Setting {
    days: number = 5
    courses: number = 7
    isOrder: Boolean = true
    steps: number = 2
    teachers: { [key: string]: string } = {}

    static load(str: string): Setting {
        try {
            const json: Setting = JSON.parse(str)
            const check =
                json.days == undefined ||
                json.courses == undefined ||
                json.isOrder == undefined ||
                json.steps == undefined ||
                json.teachers == undefined
            if (!check) {
                const setting = new Setting(
                    json.days,
                    json.courses,
                    json.isOrder,
                    json.steps,
                    json.teachers
                )
                return setting
            }
            return new Setting()
        } catch {
            return new Setting()
        }
    }

    constructor(
        days: number = 5,
        courses: number = 7,
        isOrder: Boolean = true,
        steps: number = 2,
        teachers: { [key: string]: string } = {},
    ) {
        this.days = days
        this.courses = courses
        this.isOrder = isOrder
        this.steps = steps
        this.teachers = teachers
    }

    reload(env: Env) {
        const sDay = document.getElementById(Elements.selectDays) as HTMLSelectElement
        sDay!.selectedIndex = this.days - 1

        const sCourse = document.getElementById(Elements.selectCourses) as HTMLSelectElement
        sCourse!.selectedIndex = this.courses - 1

        const sIsOrder = document.getElementById(Elements.selectIsOrder) as HTMLSelectElement
        sIsOrder!.selectedIndex = this.isOrder ? 0 : 1

        const sStep = document.getElementById(Elements.selectSteps) as HTMLSelectElement
        sStep!.selectedIndex = this.steps - 1

        const sTeacher = document.getElementById(Elements.selectTeacher) as HTMLSelectElement
        sTeacher.innerHTML = ''

        for (const name in this.teachers) {
            const raw = this.teachers[name]
            env.setup(name, raw)
        }

        const s = document.getElementById(Elements.selectTeacher)
        for (const t of env.teachers()) {
            const opt = document.createElement('option');
            opt.value = t;
            opt.innerHTML = t;
            s?.appendChild(opt);
        }

        this.cleanAll()
    }

    cleanAll() {
        clean(Elements.originTable)
        clean(Elements.toTable)
        clean(Elements.selectSol)
        const sTeacher = document.getElementById(Elements.selectTeacher) as HTMLSelectElement
        sTeacher.selectedIndex = -1
    }

    save() {
        const str = JSON.stringify(this)
        console.log(`Save ${str}`)
        document.cookie = str
    }
}