import { emailConfig } from "../../config.js";

class MTS_service {
  subarray(array) {
    let size = 15; //размер подмассива
    let subarray = []; //массив в который будет выведен результат.
    for (let i = 0; i < Math.ceil(array.length / size); i++) {
      subarray[i] = array.slice(i * size, i * size + size);
    }
    return subarray;
  }
  async sentSMS_smtp(data) {
    const sub_array_prin_promises = this.subarray(data.tlf_prin).map(
      async (el) => {
        return await sentmail(
          emailConfig.SMTPSentcliSMS.emailto,
          el.join(";"),
          emailConfig.SMTPSentcliSMS.textprin
        );
      }
    );
    const sub_array_vipoln_promises = this.subarray(data.tlf_vipoln).map(
      async (el) => {
        return await sentmail(
          emailConfig.SMTPSentcliSMS.emailto,
          el.join(";"),
          emailConfig.SMTPSentcliSMS.textvipoln
        );
      }
    );
    const sub_array_opros_promises = this.subarray(data.tlf_opros).map(
      async (el) => {
        return await sentmail(
          emailConfig.SMTPSentcliSMS.emailto,
          el.join(";"),
          emailConfig.SMTPSentcliSMS.textopros
        );
      }
    );
    Promise.all([
      ...sub_array_opros_promises,
      ...sub_array_prin_promises,
      ...sub_array_vipoln_promises,
    ]);
  }
}

export default new MTS_service();
