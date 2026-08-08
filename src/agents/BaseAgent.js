export default class BaseAgent {
  constructor(name) {
    this.name = name;
  }

  log(message) {
    const timestamp = new Date().toISOString().substring(11, 19);
    console.log(`[${timestamp}] [Agent: ${this.name}] ${message}`);
  }

  async runSkill(skill, ...args) {
    this.log(`Executing skill: ${skill.constructor.name}`);
    return await skill.execute(...args);
  }
}
