var URL = {
  GROUPS: '/api/v1/category_groups',
  MEMBERSHIPS: '/api/v1/category_group_memberships'
}
var ENTITIES= {
  GROUP: 'category_group',
  MEMBERSHIP: 'category_group_membership'
}

class DataService {

  updateGroup(oldGroup, newGroup) {
    let groupId = oldGroup.id || oldGroup;
    let newName = newGroup.name || newGroup;
    let url = `${URL.GROUPS}/${groupId}`;
    let body = {};
    body[ENTITIES.GROUP] = {
      name: newName
    }
    return this.goFetch(url, "PATCH", body);
  }

  createGroup(newGroup) {
    let newName = newGroup.name || newGroup;
    let url = `${URL.GROUPS}`;
    let body = {};
    body[ENTITIES.GROUP] = {
      name: newName
    }
    return this.goFetch(url, "POST", body);
  }

  getGroups() {
    let url = `${URL.GROUPS}`;
    return this.goFetch(url, "GET", {});
  }

  deleteGroup(group) {
    let groupId = oldGroup.id || oldGroup;
    let url = `${URL.GROUPS}/${groupId}`;
    let body = {};
    return this.goFetch(url, "DELETE", body);
  }

  updateMembership(oldMembership, newMembership) {
    let membershipId = oldMembership.id || oldMembership;
    let categoryName = newGroup.name || newGroup;
    let url = `${URL.GROUPS}/${groupId}`;
    let body = {};
    body[ENTITIES.GROUP] = {
      name: newName
    }
    return this.goFetch(url, "PATCH", body);
  }

  createMembership(membership) {

  }

  deleteMembership(membership) {

  }

  getmemberships() {

  }

  goFetch(url, method, body) {
    return fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

}