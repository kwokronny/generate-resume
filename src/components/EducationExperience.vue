<template>
	<el-card shadow="never">
		<h3 class="panel-header">
			教育经历
			<el-link type="primary" class="float-r no-print" @click="edit()">添加</el-link>
		</h3>
		<p class="text-a_c"></p>
		<el-timeline v-if="experienceList.length">
			<draggable handle=".drag-handle" @end="moved">
				<el-timeline-item
					placement="top"
					v-for="(item,index) in experienceList"
					:key="index"
					:class="{'no-print': item.hide}"
					:timestamp="item.time"
				>
					<el-form-auto
						v-if="editorIndex == index"
						size="small"
						:data="formData"
						v-model="model"
						label-width="90px"
					>
						<el-button size="medium" type="primary" @click="save">保存</el-button>
						<el-button size="medium" type="default" @click="cancel">取消</el-button>
					</el-form-auto>
					<template v-else>
						<div>
							[{{item.level}} - {{item.diurnal?'全日制':"非全日制"}}]
							<strong>{{item.school}}</strong>
							{{item.professional}}
							<span class="float-r no-print">
								<el-checkbox :value="item.hide" @change="switchHide($event,index)">打印隐藏</el-checkbox>
								<el-link class="spac-mh_10 drag-handle" type="primary">
									<i class="el-icon-d-caret"></i>调序
								</el-link>
								<el-link class="spac-mr_10" type="primary" @click="edit(index)">编辑</el-link>
								<el-popconfirm title="确定删除吗？" @confirm="delect(index)">
									<el-link type="danger" slot="reference">删除</el-link>
								</el-popconfirm>
							</span>
						</div>
					</template>
				</el-timeline-item>
			</draggable>
		</el-timeline>
		<el-empty v-else description="请添加教育经历"></el-empty>
	</el-card>
</template>
<script lang="ts">
import { ElFormAutoField } from "element-ui-saas-extend/types/form-auto";
import { Vue, Component, Model } from "vue-property-decorator"

@Component
export default class EducationExperience extends Vue {

	@Model("input", { type: Array, default: () => [] }) experience!: any[]

	private model: Record<string, any> = {}

	get experienceList() {
		return this.experience.map((item: any) => {
			item = Object.assign({}, item)
			if (item.time) {
				item.time = item.time.join(" 至 ");
			} else {
				item.time = ""
			}
			return item;
		})
	}

	private save() {
		this.experience.splice(this.editorIndex, 1, Object.assign({}, this.model))
		this.model = {}
		this.editorIndex = -1;
	}

	private cancel() {
		if (this.isNew) {
			this.experience.splice(this.editorIndex, 1)
		}
		this.editorIndex = -1;
		this.model = {};
	}

	private editorIndex = -1
	private isNew: boolean = false;

	private edit(index: number = -1) {
		if (this.editorIndex > -1) return;
		this.isNew = index == -1;
		if (index == -1) {
			this.isNew = true;
			this.experience.splice(0, 0, {})
			index = 0;
		}
		this.model = Object.assign({}, this.experience[index]);
		this.editorIndex = index;
	}

	private moved(evt: any) {
		let temp = this.experience[evt.newIndex]
		this.$set(this.experience, evt.newIndex, this.experience[evt.oldIndex])
		this.$set(this.experience, evt.oldIndex, temp)
	}

	private switchHide(value: boolean, index: number) {
		this.$set(this.experience[index], "hide", value)
	}
	
	private delect(index: number) {
		this.experience.splice(index, 1)
	}

	private formData: Record<string, ElFormAutoField> = {
		school: {
			label: "学校",
			type: "text",
			col: 12
		},
		time: {
			label: "时间",
			type: "monthrange",
			valueFormat: "yyyy年MM月",
			style: "width: 100%",
			col: 12
		},
		level: {
			label: "学历",
			type: "select",
			style: "width: 100%",
			options: ["初中及以下", "高中", "中技", "中专", "高技", "大专", "本科", "硕士", "博士", "MBA"],
			col: 12
		},
		diurnal: {
			label: "全日制",
			type: "switch",
			col: 12
		},
		professional: {
			label: "专业",
			type: "text",
			col: 12
		}
	}

}
</script>
