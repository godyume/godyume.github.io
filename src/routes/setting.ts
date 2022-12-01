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
        // const _setting = document.cookie;
        // const setting: Setting
        // //  = (_setting === '' || !_setting) ? new Setting() : JSON.parse(_setting)
        try {
            return JSON.parse(str)
        } catch (err) {
            return new Setting();
        }
    }
    constructor() {
        this.days = 5
        this.courses = 7
        this.isOrder = true
        this.steps = 2
        this.teachers = {}
    }

    setDays(days: number) {
        this.days = days
        this.cleanAll()
        this.save()
    }
    setCourses(courses: number) {
        this.courses = courses
        this.cleanAll()
        this.save()
    }
    setIsOrder(isOrder: Boolean) {
        this.isOrder = isOrder
        this.cleanAll()
        this.save()
    }
    setSteps(steps: number) {
        this.steps = steps
        this.cleanAll()
        this.save()
    }
    setTeachers(teachers: { [key: string]: string }) {
        this.teachers = teachers
        this.cleanAll()
        this.save()
    }

    private cleanAll() {
        clean(Elements.originTable)
        clean(Elements.toTable)
        clean(Elements.selectSol)
    }

    private save() {
        const str = JSON.stringify(this)
        console.log(str)
        document.cookie = str
    }
}