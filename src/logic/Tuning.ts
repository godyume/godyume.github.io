export interface Name {
    name: String
}

export abstract class Base implements Name {
    name: String

    constructor(name: String) {
        this.name = name;
    }

    toString(): String {
        return this.name;
    }
}

export class Teacher extends Base { }
export class Course extends Base { }

export class Unit {
    teacher: Teacher
    course: Course
    index: number

    constructor(teacher: Teacher, course: Course, index: number) {
        this.teacher = teacher;
        this.course = course;
        this.index = index;
    }

    toString(): String {
        return `${this.teacher.name} ${this.course.name}${this.index}`;
    }
}

/// 兩者班級必須相同
export class Change {
    from: Unit
    to: Unit
    constructor(from: Unit, to: Unit) {
        this.from = from;
        this.to = to;
    }

    toString(): String {
        return `班級'${this.from.course.name}': [${this.from.teacher.name} ${+this.from.index + 1}] <-> [${this.to.teacher.name} ${+this.to.index + 1}]`
        // 班級'\(`class`.name)': [\(origin.name) \(from+1)] <-> [\(next.name) \(to+1)]
    }

    removes(): Unit[] {
        return [
            this.from, this.to,
        ];
    }

    addFrom(): Unit {
        return new Unit(
            this.from.teacher,
            this.from.course,
            this.to.index
        );
    }

    addTo(): Unit {
        return new Unit(
            this.to.teacher,
            this.to.course,
            this.from.index
        );
    }
}

enum Rule {
    invalid,
    tempValid,
    valid,
}

export class Env {
    changes: Change[] = []
    set: Unit[] = [];

    days: number = 5
    courses: number = 7
    // var count = 0

    teachers(): string[] {
        const set = new Set<string>();
        for (const unit of this.set) {
            set.add(unit.teacher.name.toString())
        }

        return Array.from(set).sort((l, r) => l > r ? -1 : 1);
    }

    reset() {
        this.changes = [];
        this.set = [];
    }

    index(x: number, y: number): number {
        return +this.courses * x + y
    }

    indexOf(unit: Unit): number {
        return this.set.findIndex((t) => {
            return t.teacher.name === unit.teacher.name &&
                t.course.name === unit.course.name &&
                t.index == unit.index
        })
    }

    delete(unit: Unit) {
        const index = this.indexOf(unit)
        if (index > -1) {
            this.set.splice(index, 1);
        }
    }

    /// 1~7 
    setDays(days: number) {
        this.days = Math.min(Math.max(+days, 1), 7)
    }

    /// 1~N
    setCourses(courses: number) {
        this.courses = Math.max(+courses, 1)
    }

    private parse(raw: string): [course: Course, index: number][] {
        const result: [course: Course, index: number][] = raw.split('\n').flatMap((line, day) => {
            if (day > this.days) return [];
            const result: [course: Course, index: number][] = line.split(',').flatMap((name, index) => {
                if (name === '') return [];
                if (index > this.courses) return [];
                const course = new Course(name)
                const i = +day * +this.courses + index
                return [[course, i]]
            })

            return result
        })

        return result
    }

    setup(name: string, raw: string) {
        const teacher = new Teacher(name)
        for (const [course, index] of this.parse(raw)) {
            const unit = new Unit(teacher, course, index)
            // this.set.add(unit)
            this.set.push(unit)
        }
    }

    private all(): Unit[] {
        return this.set
    }

    /// T -> index -> C
    findByTeacher(teacher: Teacher, index?: number): Unit[] {
        if (index != null) {
            return this.all().filter((unit) => unit.teacher.name === teacher.name && unit.index == index);
        }
        return this.all().filter((unit) => unit.teacher.name == teacher.name);
    }

    /// C -> index -> T
    findByCourse(course: Course, index?: number): Unit[] {
        if (index != null) {
            return this.all().filter((unit) => unit.course.name === course.name && unit.index === index);
        }
        return this.all().filter((unit) => unit.course.name === course.name);
    }

    findByIndex(index: number): [day: number, i: number] {
        const day = (+index % +this.courses) + 1
        const i = (+index / +this.courses) + 1
        return [day, i]
    }

    private copy(): Env {
        const env = new Env();
        // env.set = new Set(this.set);
        env.set = Array.from(this.set);
        env.changes = Array.from(this.changes);
        env.days = this.days
        env.courses = this.courses
        return env;
    }

    /// 合法:
    ///   * 老師有 0~1 堂課
    /// 暫時合法:
    ///   * 老師有 2 堂課，需馬上調開
    /// 不合法:
    ///   * N < 0 || 2 < N
    append(next: Change): [env: Env, rule: Rule] {
        const copy = this.copy();
        copy.changes.push(next)

        /// 特殊規則: 不能排 `x` | `X` 課
        if (next.from.course.name === 'x' || next.from.course.name === 'X') {
            return [copy, Rule.invalid]
        }

        /// 我想換第 1 節，最後第 1 節又被佔用
        if (this.changes.length != 0) {
            const first = this.changes[0]
            if (first.from.index == next.to.index) {
                return [copy, Rule.invalid]
            }
        }

        /// 檢查調課後，課不少於0
        for (const r of next.removes()) {
            if (copy.indexOf(r) != -1) {
                copy.delete(r)
            } else {
                return [copy, Rule.invalid]
            }
        }

        /// 對方有空
        if (this.findByTeacher(next.addTo().teacher, next.addTo().index).length == 0) {
            copy.set.push(next.addTo())
        } else {
            return [copy, Rule.invalid]
        }

        switch (this.findByTeacher(next.addFrom().teacher, next.addFrom().index).length) {
            case 0:
                copy.set.push(next.addFrom())
                return [copy, Rule.valid]
            case 1:
                copy.set.push(next.addFrom())
                return [copy, Rule.tempValid]
            default:
                return [copy, Rule.invalid]
        }
    }

    change(teacher: Teacher, index: number, round: number): Env[] {
        /// find course
        const courses = this.findByTeacher(teacher, index)
        if (courses.length <= 0) {
            return []
        }
        const course = courses[0].course

        const unit = new Unit(teacher, course, index)
        return this._change(unit, round)
    }

    private _change(from: Unit, round: number): Env[] {
        //         guard round > 0 else { return [] }
        if (round <= 0) { return [] }

        /// 我想調的 `班級`，所有相關老師
        const relativeTeachers: Unit[] = this.findByCourse(from.course)
            /// 相關老師不包含自己
            .filter((unit) => unit.teacher.name !== from.teacher.name)

        const envs: Env[] = relativeTeachers.flatMap((to) => {
            const change = new Change(from, to)
            const [result, rule] = this.append(change)
            switch (rule) {
                case Rule.invalid:
                    return []
                case Rule.valid:
                    return [result]
                case Rule.tempValid:
                    const t = from.teacher
                    const index = change.to.index

                    return this.findByTeacher(t, index)
                        .filter((unit) => unit.course.name !== from.course.name)
                        .flatMap((unit) => result._change(unit, +round - 1))
            }
        });

        return envs
    }

    // /// for  debug
    // extension Env {
    //     private var involvedTeachers: [Teacher] {
    //         var set: Set<Teacher> = .init()
    //         for change in data {
    //             set.insert(change.origin)
    //             set.insert(change.next)
    //         }
    //         return set.sorted { l, r in
    //             l.name < r.name
    //         }
    //     }

    //     func origin() {
    //         for t in involvedTeachers {
    //             let lessons = t.data.enumerated().map { index, c in
    //                 guard let c = c else {
    //                     return "  "
    //                 }
    //                 return "\(c)\(index+1)"
    //             }.joined(separator: " ")
    //             print("\(t.name)\t\(lessons)")
    //         }
    //     }

    //     func changed() {
    //         for t in involvedTeachers {
    //             let lessons = (0..<count).map { index in
    //                 guard let a = self[t, index].first else {
    //                     return "  "
    //                 }
    //                 let c = a.class
    //                 let index = a.index
    //                 return "\(c)\(index+1)"
    //             }.joined(separator: " ")
    //             print("\(t.name)\t\(lessons)")
    //         }
    // }

    renderTable(table: HTMLElement, teacher: Teacher, isOrder: Boolean, callback: (num: number, cell: HTMLTableCellElement) => void) {
        table.innerHTML = ''
        const _xAxis = new Array(this.days).fill(0).map((num, i) => i)
        const xAxis = isOrder ? _xAxis : _xAxis.reverse()
        const yAxis = new Array(this.courses).fill(0).map((num, i) => i)

        const headerTr = document.createElement('tr')
        for (const x of xAxis) {
            const th = document.createElement('th')
            th.innerHTML = `星期${x + 1}`
            th.style.border = '1px solid #333'
            th.style.borderCollapse = 'collapse'
            headerTr.appendChild(th)
        }
        const emptyTd = document.createElement('td')
        emptyTd.innerHTML = ''
        emptyTd.style.border = '1px solid #333'
        emptyTd.style.borderCollapse = 'collapse'
        headerTr.appendChild(emptyTd)
        table.appendChild(headerTr)

        for (const y of yAxis) {
            const tr = document.createElement('tr')
            for (const x of xAxis) {
                const td = document.createElement('td')
                const index = +this.courses * x + y
                const units = this.findByTeacher(teacher, index)
                td.id = `o${index}`
                td.style.border = '1px solid #333'
                td.style.borderCollapse = 'collapse'
                if (units.length > 0) {
                    td.innerHTML = `${units[0].course.name}`
                    td.onclick = () => {
                        callback(index, td)
                    }
                } else {
                    td.innerHTML = ''
                }
                tr.appendChild(td)
            }
            const indexTd = document.createElement('td')
            indexTd.innerHTML = `第${y + 1}節`
            indexTd.style.border = '1px solid #333'
            indexTd.style.borderCollapse = 'collapse'
            tr.appendChild(indexTd)
            table.appendChild(tr)
        }
    }

    renderTable2(table: HTMLElement, teacher: Teacher, isOrder: Boolean) {
        table.innerHTML = ''
        const _xAxis = new Array(this.days).fill(0).map((num, i) => i)
        const xAxis = isOrder ? _xAxis : _xAxis.reverse()
        const yAxis = new Array(this.courses).fill(0).map((num, i) => i)

        const headerTr = document.createElement('tr')
        for (const x of xAxis) {
            const th = document.createElement('th')
            th.style.border = '1px solid #333'
            th.style.borderCollapse = 'collapse'
            th.innerHTML = `星期${x + 1}`
            headerTr.appendChild(th)
        }
        const emptyTd = document.createElement('td')
        emptyTd.style.border = '1px solid #333'
        emptyTd.style.borderCollapse = 'collapse'
        emptyTd.innerHTML = ''
        headerTr.appendChild(emptyTd)
        table.appendChild(headerTr)

        for (const y of yAxis) {
            const tr = document.createElement('tr')
            for (const x of xAxis) {
                const td = document.createElement('td')
                const div = document.createElement('div')
                const p = document.createElement('p')

                const index = this.index(x, y)
                const units = this.findByTeacher(teacher, index)
                td.style.border = '1px solid #333'
                td.style.borderCollapse = 'collapse'

                div.id = `t${index}`
                if (units.length > 0) {
                    p.innerHTML = `${units[0].course.name}`
                } else {
                    p.innerHTML = ''
                }
                tr.appendChild(td)
                td.appendChild(div)
                div.appendChild(p)
            }
            const indexTd = document.createElement('td')
            indexTd.innerHTML = `第${y + 1}節`
            indexTd.style.border = '1px solid #333'
            indexTd.style.borderCollapse = 'collapse'
            tr.appendChild(indexTd)
            table.appendChild(tr)
        }

        /// 清空
        for (const change of this.changes) {
            /// remove
            const rDiv = document.getElementById(`t${change.from.index}`)
            if (rDiv) {
                rDiv.innerHTML = ''
            }
            const aDiv = document.getElementById(`t${change.to.index}`)
            if (aDiv) {
                aDiv.innerHTML = ''
            }
        }

        for (const [index, change] of this.changes.entries()) {
            /// remove
            const rDiv = document.getElementById(`t${change.from.index}`)
            if (rDiv) {
                const p = document.createElement('p')
                rDiv.appendChild(p)
                p.style.background = '#d44'
                p.style.color = '#fff'
                p.innerHTML = `Step. ${index+1}<br>- 班級${change.from.course.name} 老師${change.to.teacher.name}`
            }

            /// add
            const aDiv = document.getElementById(`t${change.to.index}`)
            if (aDiv) {
                const p = document.createElement('p')
                aDiv.appendChild(p)
                p.style.background = '#5d5'
                p.style.color = '#fff'
                p.innerHTML = `Step. ${index+1}<br>+ 班級${change.from.course.name} 老師${change.to.teacher.name}`
            }
        }
    }
}
